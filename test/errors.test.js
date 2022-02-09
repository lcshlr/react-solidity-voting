exports.getError = (key) => {
    REJECTED_ERROR = 'VM Exception while processing transaction: reverted with reason string';
    ERROR = {
        'notAdmin': 'Not an admin',
        'alreadyAdmin': 'Already admin',
        'candidateNotExist': 'Candidate id not exist',
        'noCandidate': 'No candidate registered',
        'correctAddress': 'Provide a correct address',
        'notOwner': 'Ownable: caller is not the owner',
        'alreadyVoted': 'Only one vote by voter',
        'sessionClosed': 'Voting session not opened',
        'sessionStatus': 'Session already in this status',
        'sessionNotClosed': 'The session have to be closed'
    };
    return `${REJECTED_ERROR} '${ERROR[key]}'`;
}