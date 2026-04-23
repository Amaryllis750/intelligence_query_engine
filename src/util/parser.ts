const GENDER_MAP = {
    male: 'male', males: 'male', man: 'male', men: 'male',
    boy: 'male', boys: 'male', gentleman: 'male', gentlemen: 'male',
    female: 'female', females: 'female', woman: 'female', women: 'female',
    girl: 'female', girls: 'female', lady: 'female', ladies: 'female',
};

const AGE_MAP = {
    young: { min: 16, max: 24 },
    child: { min: 0, max: 2 },
    teenager: { min: 13, max: 19 },
    adult: { min: 20, max: 59 },
    senior: { min: 60, max: Infinity }
};

export function extractGender(tokens: string[]) {
    const found = new Set();

    for (const token of tokens) {
        const mapped = GENDER_MAP[token as keyof typeof GENDER_MAP];
        if (mapped) found.add(mapped);
    }

    if (found.size === 1) return [...found][0]; // meaning only one gender was found
    return null; // meaning both genders where found therefore no filter
}

export function extractAgeRange(query: string) {
    const result: { min?: number, max?: number } = { max: 100, min: 0 };

    // rank explicit age specifications above age group
    const between = query.match(/between\s+(\d+)\s+and\s+(\d+)/i);
    if (between) {
        result.min = parseInt(between[1] ?? "0");
        result.max = parseInt(between[2] ?? "100");
        return result; // between is unambiguous — skip further checks
    }

    const minMatch = query.match(
        /(?:above|over|older than|at least|minimum of?|from)\s+(\d+)/i
    );
    if (minMatch) result.min = parseInt(minMatch[1] ?? "0");

    const maxMatch = query.match(
        /(?:below|under|younger than|at most|maximum of?|up to)\s+(\d+)/i
    );
    if (maxMatch) result.max = parseInt(maxMatch[1] ?? "100");

    return result;
}