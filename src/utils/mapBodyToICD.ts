export const mapBodyToICD = (affectedParts: string): number[] => {
    const bodyPartsMap: { [key: string]: number } = {
        "head": 1,
        "neck": 2,
        "shoulder": 3,
        "upper arm": 4,
        "elbow": 5,
        "forearm": 6,
        "wrist": 7,
        "hand": 8,
        "chest": 9,
        "upper back": 10,
        "lower back": 11,
        "abdomen": 12,
        "pelvis": 13,
        "hip": 14,
        "thigh": 15,
    };

    const lowerCaseAffectedParts = affectedParts.toLocaleLowerCase();

    return Object.entries(bodyPartsMap)
        .filter(([part]) => lowerCaseAffectedParts.includes(part))
        .map(([, code]) => code);
};