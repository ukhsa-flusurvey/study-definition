import { Study } from "case-editor-tools/types/study";
import { studyRules } from "./rules";
import { gen_action_add_age_flag, gen_survey_condition_for_swab_question, move_weekly_to_optional, move_weekly_to_prio } from "./study-actions";


export const FluSurveyStudy: Study = {
  studyKey: 'flusurvey',
  outputFolderName: 'flusurvey',
  surveys: [],
  studyRules: studyRules,
  messageConfigs: [],
  customStudyRules: [
    gen_action_add_age_flag(),
    gen_survey_condition_for_swab_question(),
    move_weekly_to_optional(),
    move_weekly_to_prio(),
  ]
}
