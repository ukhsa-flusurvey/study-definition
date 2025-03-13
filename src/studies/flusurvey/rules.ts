import { Expression } from "survey-engine/data_types";
import { StudyRules } from "case-editor-tools/types/studyRules";
import { StudyEngine } from "case-editor-tools/expression-utils/studyEngineExpressions";
import { ParticipantFlags } from "./participantFlags";
import { surveyKeys } from "./constants";

/**
 * Define what should happen, when persons enter the study first time:
 */
const entryRules: Expression[] = [
  StudyEngine.participantActions.assignedSurveys.add(surveyKeys.intake, 'normal'),
];

const genderQuestionKey = 'intake.Q1';


/**
 * Define what should happen, when persons submit a survey:
 */
const handleIntake = StudyEngine.ifThen(
  StudyEngine.checkSurveyResponseKey(surveyKeys.intake),
  // then do:
  StudyEngine.participantActions.assignedSurveys.remove(surveyKeys.intake, 'all'),
  StudyEngine.ifThen(
    StudyEngine.not(
      StudyEngine.participantState.hasSurveyKeyAssigned(surveyKeys.weekly)
    ),
    StudyEngine.participantActions.assignedSurveys.add(surveyKeys.weekly, 'prio')
  ),

  StudyEngine.participantActions.assignedSurveys.add(surveyKeys.intake, 'optional'),
  StudyEngine.participantActions.assignedSurveys.add(surveyKeys.intake, 'normal',
    StudyEngine.getTsForNextISOWeek(
      36,
      StudyEngine.timestampWithOffset({ days: 4 * 7 })
    )
  ),

  // Set gender flag:
  StudyEngine.if(
    StudyEngine.singleChoice.any(genderQuestionKey, "1"),
    StudyEngine.participantActions.updateFlag(ParticipantFlags.gender.key, ParticipantFlags.gender.values.female),
    StudyEngine.if(
      StudyEngine.singleChoice.any(genderQuestionKey, "0"),
      StudyEngine.participantActions.updateFlag(ParticipantFlags.gender.key, ParticipantFlags.gender.values.male),
      StudyEngine.if(
        StudyEngine.singleChoice.any(genderQuestionKey, "2"),
        StudyEngine.participantActions.updateFlag(ParticipantFlags.gender.key, ParticipantFlags.gender.values.other),
      )
    )
  ),
  // Birthdate flag:
  StudyEngine.participantActions.updateFlag(
    ParticipantFlags.birthdate.key,
    StudyEngine.getResponseValueAsNum(
      ParticipantFlags.birthdate.from.itemKey,
      ParticipantFlags.birthdate.from.slotKey
    )
  )
)

const studyCodeListKeyForSwab = 'swabCodes';
const linkingCodeKeyForSwab = 'swabCode';

const handleWeekly = StudyEngine.ifThen(
  StudyEngine.checkSurveyResponseKey(surveyKeys.weekly),
  // then do:
  StudyEngine.participantActions.assignedSurveys.remove(surveyKeys.weekly, 'all'),
  StudyEngine.participantActions.assignedSurveys.add(surveyKeys.weekly, 'prio', StudyEngine.timestampWithOffset({
    minutes: 60,
  })),
  // Manage flags:
  StudyEngine.if(
    // if has ongoing symptoms:
    StudyEngine.singleChoice.any('weekly.HS.Q4', '2'),
    // then:
    StudyEngine.participantActions.updateFlag(
      ParticipantFlags.hasOnGoingSymptoms.key,
      ParticipantFlags.hasOnGoingSymptoms.values.yes
    ),
    // else:
    StudyEngine.participantActions.updateFlag(
      ParticipantFlags.hasOnGoingSymptoms.key,
      ParticipantFlags.hasOnGoingSymptoms.values.no
    )
  ),

  // Swab logic
  StudyEngine.ifThen(
    StudyEngine.and(
      // lives in england
      StudyEngine.singleChoice.any('weekly.Swab.Loc', '1'),
      // older than 18 years
      StudyEngine.gt(
        StudyEngine.timestampWithOffset({ years: -18 }),
        StudyEngine.participantState.getParticipantFlagValueAsNum(ParticipantFlags.birthdate.key)
      )
    ),
    // Draw swab code
    StudyEngine.participantActions.linkingCodes.drawFromStudyCodeList(
      studyCodeListKeyForSwab,
      linkingCodeKeyForSwab,
    ),
    StudyEngine.if(
      StudyEngine.participantState.linkingCode.has(linkingCodeKeyForSwab),
      // If the participant has a swab code
      StudyEngine.do(
        StudyEngine.participantActions.messages.add(
          'invite-for-swab',
          StudyEngine.timestampWithOffset({ days: 0 }),
        ),
        StudyEngine.participantActions.reports.init(
          studyCodeListKeyForSwab,
        ),
        StudyEngine.participantActions.reports.updateData(
          studyCodeListKeyForSwab,
          linkingCodeKeyForSwab,
          StudyEngine.participantState.linkingCode.get(linkingCodeKeyForSwab),
        )
      ),
      // If the participant does not have a swab code
      StudyEngine.do(
        StudyEngine.participantActions.messages.add(
          'no-swab-code',
          StudyEngine.timestampWithOffset({ days: 0 }),
        ),
      )
    )
  )



)



const submitRules: Expression[] = [
  handleIntake,
  handleWeekly,
];

const timerRules: Expression[] | undefined = undefined

/**
 * STUDY RULES
 */
export const studyRules = new StudyRules(
  entryRules,
  submitRules,
  timerRules,
)
