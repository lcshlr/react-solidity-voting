exports.getError = (key) => {
    REJECTED_ERROR = 'VM Exception while processing transaction: reverted with reason string';
    ERROR = {
        'notAdmin': 'Not an admin',
        'alreadyAdmin': 'Already admin',
        'candidateNotExist': 'Candidate id not exist',
        'correctAddress': 'Provide a correct address',
        'notOwner': 'Ownable: caller is not the owner'
    };
    return `${REJECTED_ERROR} '${ERROR[key]}'`;
}