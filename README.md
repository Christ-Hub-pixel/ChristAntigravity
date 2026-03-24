# 🦉 CodeLingo — Guide de Déploiement

Ce guide vous explique comment mettre votre site **CodeLingo** en ligne gratuitement pour le partager avec d'autres personnes.

## 🚀 Option 1 : Vercel (Le plus rapide)
C'est la méthode recommandée pour obtenir une URL en moins d'une minute.

1.  Ouvrez un terminal (PowerShell ou Invite de commandes) dans le dossier du projet.
2.  Tapez la commande suivante :
    ```powershell
    npx vercel
    ```
3.  Suivez les instructions à l'écran (appuyez sur **Y** et **Entrée** pour les choix par défaut).
4.  Une fois terminé, vous recevrez une URL du type `codelingo-app.vercel.app`.

## ☁️ Option 2 : Netlify (Glisser-Déposer)
Idéal si vous ne voulez pas utiliser de ligne de commande.

1.  Allez sur [Netlify.com](https://www.netlify.com/).
2.  Créez un compte gratuit ou connectez-vous.
3.  Allez dans la section **"Add new site"** > **"Deploy manually"**.
4.  Glissez-déposez le dossier entier `ChristAntigravity` sur la zone de dépôt.
5.  Votre site est en ligne immédiatement avec une URL aléatoire (que vous pouvez personnaliser dans les paramètres Netlify).

## 🐱 Option 3 : GitHub Pages (Hébergement permanent)
Si vous utilisez GitHub pour stocker votre code.

1.  Créez un nouveau dépôt sur GitHub et poussez votre code.
2.  Allez dans **Settings** (Paramètres) > **Pages**.
3.  Dans **Branch**, choisissez `main` (ou `master`) et cliquez sur **Save**.
4.  Votre site sera disponible à l'adresse : `nom-utilisateur.github.io/ChristAntigravity`.

---
*Note : Pour un partage temporaire immédiat depuis votre ordinateur sans hébergement, vous pouvez aussi utiliser :*
`npx localtunnel --port 5500` *(Remplacez 5500 par le port de votre serveur local)*
