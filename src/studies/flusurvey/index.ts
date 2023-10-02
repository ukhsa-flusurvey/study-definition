import { Study } from "case-editor-tools/types/study";
import { studyRules } from "./rules";


export const FluSurveyStudy: Study = {
  studyKey: 'flusurvey',
  outputFolderName: 'flusurvey',
  surveys: [],
  studyRules: studyRules,
  messageConfigs: [],
  customStudyRules: []
}
