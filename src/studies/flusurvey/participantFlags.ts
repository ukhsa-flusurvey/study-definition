export const ParticipantFlags = {
  hasOnGoingSymptoms: {
    key: 'prev',
    values: {
      no: '0',
      yes: '1'
    }
  },
  gender: {
    key: 'gender',
    values: {
      female: 'female',
      male: 'male',
      other: 'other',
    },
  },
  birthdate: {
    key: 'birthdate',
    from: {
      itemKey: 'intake.Q2',
      slotKey: 'rg.1',
    }
  }
}

