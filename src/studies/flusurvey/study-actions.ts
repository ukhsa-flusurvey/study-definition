import { StudyEngine } from "case-editor-tools/expression-utils/studyEngineExpressions"
import { SurveyEngine } from 'case-editor-tools/surveys/survey-engine-expressions';
import { Expression } from "survey-engine/data_types"
import { ParticipantFlags } from "./participantFlags";
import { surveyKeys } from "./constants";

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

export const move_weekly_to_optional = () => {
  return {
    name: 'move_weekly_to_optional',
    rules: [
      StudyEngine.ifThen(
        StudyEngine.participantState.hasSurveyKeyAssigned('weekly'),
        StudyEngine.participantActions.assignedSurveys.remove(
          'weekly',
          'all'
        ),
        StudyEngine.participantActions.assignedSurveys.add(
          'weekly',
          'optional'
        )
      )
    ]
  }
}

export const move_weekly_to_prio = () => {
  return {
    name: 'move_weekly_to_prio',
    rules: [
      StudyEngine.ifThen(
        StudyEngine.participantState.hasSurveyKeyAssigned('weekly'),
        StudyEngine.participantActions.assignedSurveys.remove(
          'weekly',
          'all'
        ),
        StudyEngine.participantActions.assignedSurveys.add(
          'weekly',
          'prio'
        )
      )
    ]
  }
}

export const init_has_intake_this_season = () => {
  return {
    name: 'init_has_intake_this_season',
    rules: [
      StudyEngine.ifThen(
        StudyEngine.lt(
          StudyEngine.timestampWithOffset(
            { days: 0 },
            1759276800
          ),
          StudyEngine.participantState.getLastSubmissionDate(surveyKeys.intake),
        ),
        StudyEngine.participantActions.updateFlag(ParticipantFlags.hasIntakeThisSeason.key, ParticipantFlags.hasIntakeThisSeason.values.yes),
      )
    ]
  }
}

export const remove_has_intake_flag_this_season = () => {
  return {
    name: 'remove_has_intake_flag_this_season',
    rules: [
      StudyEngine.ifThen(
        StudyEngine.gt(
          StudyEngine.timestampWithOffset({ days: -4 * 7 }),
          StudyEngine.participantState.getLastSubmissionDate(surveyKeys.intake),
        ),
        StudyEngine.participantActions.removeFlag(ParticipantFlags.hasIntakeThisSeason.key)
      )
    ]
  }
}

// export const send_message_to_joined_flu_ss_pilot = () => {
//   return {
//     name: 'send_message_to_joined_flu_ss_pilot',
//     rules: [
//       StudyEngine.ifThen(
//         StudyEngine.participantState.hasParticipantFlagKey(ParticipantFlags.joinedFluSSPilotAt.key),
//         StudyEngine.participantActions.messages.add(
//           '<message-key>',
//           StudyEngine.timestampWithOffset({ days: 0 }),
//         )
//       )
//     ]
//   }
// }
