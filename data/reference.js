// ============================================================
// CodeLingo — Reference Handbook Data
// ============================================================

const REFERENCE_DATA = {
  python: {
    title: 'Python Reference',
    icon: '🐍',
    categories: [
      {
        name: 'Bases',
        items: [
          {
            id: 'py-print',
            name: 'print()',
            desc: 'Affiche du texte ou des variables sur la console.',
            syntax: 'print(valeur)',
            example: 'print("Hello CodeLingo!")',
            tryIt: 'print("Bonjour le monde !")\n# Essayez de changer le texte'
          },
          {
            id: 'py-comments',
            name: 'Commentaires',
            desc: 'Utilisé pour expliquer le code. Ignoré par Python.',
            syntax: '# commentaire',
            example: '# Ceci est un commentaire\nprint("Salut")',
            tryIt: '# Testez vos propres commentaires\nprint("Le code tourne !")'
          }
        ]
      },
      {
        name: 'Variables & Types',
        items: [
          {
            id: 'py-vars',
            name: 'Variables',
            desc: 'Sert à stocker des données.',
            syntax: 'nom = valeur',
            example: 'x = 5\nnom = "Alice"',
            tryIt: 'nom = "CodeLingo"\nage = 5\nprint(nom)\nprint(age)'
          },
          {
            id: 'py-types',
            name: 'Types de données',
            desc: 'Les types principaux de Python.',
            syntax: 'int, float, str, bool',
            example: 'x = 10 # int\ny = 2.5 # float\nz = "A" # str',
            tryIt: 'print(type(42))\nprint(type(3.14))\nprint(type("Texte"))'
          }
        ]
      }
    ]
  },
  javascript: {
    title: 'JS Reference',
    icon: '🟨',
    categories: [
      {
        name: 'Base',
        items: [
          {
            id: 'js-console',
            name: 'console.log()',
            desc: 'Affiche un message dans la console de debug.',
            syntax: 'console.log(valeur);',
            example: 'console.log("Hello JS");',
            tryIt: 'console.log("Bienvenue !");\nconsole.log(10 + 20);'
          }
        ]
      },
      {
        name: 'Keywords',
        items: [
          {
            id: 'js-let',
            name: 'let / const',
            desc: 'Déclaration de variables (modifiables ou constantes).',
            syntax: 'let x = 1;\nconst y = 2;',
            example: 'let score = 0;\nconst pi = 3.14;',
            tryIt: 'let score = 10;\nscore = score + 5;\nconsole.log(score);'
          }
        ]
      }
    ]
  }
};
