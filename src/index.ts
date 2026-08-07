import { Logger } from "case-editor-tools/logger/logger";
import { Study } from "case-editor-tools/types/study";
import { FluSurveyStudy } from './studies/flusurvey';
import { generateFilesForStudy } from 'case-editor-tools/exporter';


const studies: Study[] = [
  FluSurveyStudy,
];

const defaultStudyKey = 'flusurvey';

const readStudyKey = () => {
  const args = process.argv.slice(2);
  const studyKeyArg = args.find(arg => arg.startsWith('study='));

  return studyKeyArg?.replace('study=', '') || defaultStudyKey;
}

const studyKey = readStudyKey();

const currentStudy = studies.filter(study => {
  if (study.outputFolderName && study.outputFolderName === studyKey) {
    return true;
  }
  return study.studyKey === studyKey
});
if (!currentStudy || currentStudy.length < 1) {
  Logger.error(`No study find with key: ${studyKey}.`);
  process.exit(1)
}

const prettyJSON = false;
currentStudy.forEach(study => generateFilesForStudy(study, prettyJSON));
