function generateRandomString(length,) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }

    return randomString;
}

export function generateIdentifiant(username, stringLength) {
    // Générer une chaîne aléatoire de la longueur spécifiée
    const randomString = generateRandomString(stringLength);

    // Combiner le nom d'utilisateur avec la chaîne aléatoire
    return username + randomString;
}

