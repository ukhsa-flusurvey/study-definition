import { StudyEngine } from "case-editor-tools/expression-utils/studyEngineExpressions"
import { SurveyEngine } from 'case-editor-tools/surveys/survey-engine-expressions';
import { Expression } from "survey-engine/data_types"
import { ParticipantFlags } from "./participantFlags";

export const gen_action_add_age_flag = () => {
  const rules: Expression[] = [
    // In intake, use age question to set age flag:
    StudyEngine.participantActions.updateFlag(
      ParticipantFlags.birthdate.key,
      StudyEngine.getResponseValueAsNum(
        ParticipantFlags.birthdate.from.itemKey,
        ParticipantFlags.birthdate.from.slotKey
      )
    )
  ]
  return {
    rules: rules,
    name: 'update_age_flag_from_intake',
  };
}

export const gen_survey_condition_for_swab_question = () => {
  return {
    name: 'survey_condition_for_swab_question',
    rules: [
      SurveyEngine.logic.and(
        // is 18 or older
        SurveyEngine.compare.gt(
          SurveyEngine.timestampWithOffset({ years: -18 }),
          SurveyEngine.participantFlags.getAsNum(ParticipantFlags.birthdate.key)
        ),
        StudyEngine.multipleChoice.none(
          'weekly.q1.1',
          '0'
        )
      )
    ]
  }
}
