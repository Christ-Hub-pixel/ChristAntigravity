// ============================================================
// CodeLingo — Course Data
// ============================================================

const COURSES = {
  python: {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    color: '#3776ab',
    accent: '#ffd43b',
    description: 'Maitrisez Python de zéro au niveau expert',
    units: [
      {
        id: 'py-basics',
        title: 'Bases de Python',
        icon: '🌱',
        color: '#22c55e',
        xpReward: 20,
        lessons: [
          {
            id: 'py-basics-1',
            title: 'Votre Premier Programme',
            icon: '👋',
            xpReward: 10,
            exercises: [
              {
                type: 'mcq',
                question: 'Que va afficher le code suivant ?\n\nprint("Hello, World!")',
                options: ['Hello World', 'Hello, World!', '"Hello, World!"', 'Error'],
                correct: 1,
                explanation: 'print() affiche le texte entre parenthèses. Les guillemets définissent une chaîne mais ne sont pas affichés.'
              },
              {
                type: 'fill',
                question: 'Complétez le code pour afficher "Python est génial !"',
                code: '___("Python est génial !")',
                answer: 'print',
                hint: 'La fonction intégrée pour afficher du texte en Python',
                explanation: 'print() est la fonction intégrée de Python pour afficher une sortie.'
              },
              {
                type: 'mcq',
                question: 'Laquelle de ces instructions print est valide en Python ?',
                options: ['PRINT("salut")', 'print "salut"', 'print("salut")', 'Print("salut")'],
                correct: 2,
                explanation: 'Python est sensible à la casse. print() doit être en minuscules et nécessite des parenthèses.'
              },
              {
                type: 'output',
                question: 'Quelle est la sortie de ce code ?',
                code: 'print("Code")\nprint("Lingo")',
                options: ['Code Lingo', 'CodeLingo', 'Code\nLingo', 'Error'],
                correct: 2,
                explanation: 'Chaque appel à print() ajoute un saut de ligne par défaut.'
              }
            ]
          },
          {
            id: 'py-basics-2',
            title: 'Commentaires et Style',
            icon: '💬',
            xpReward: 10,
            exercises: [
              {
                type: 'mcq',
                question: 'Comment écrire un commentaire sur une seule ligne en Python ?',
                options: ['// Ceci est un commentaire', '/* Commentaire */', '# Ceci est un commentaire', '-- Commentaire'],
                correct: 2,
                explanation: 'Python utilise le symbole # pour les commentaires sur une seule ligne.'
              },
              {
                type: 'fill',
                question: 'Ajoutez un commentaire pour expliquer le code :',
                code: '___ Ce code dit bonjour\nprint("Bonjour !")',
                answer: '#',
                hint: 'Le caractère de commentaire en Python',
                explanation: '# commence un commentaire simple en Python. Tout ce qui suit sur cette ligne est ignoré.'
              },
              {
                type: 'output',
                question: 'Que va afficher ce code ?',
                code: '# print("Caché")\nprint("Visible")',
                options: ['Caché\nVisible', 'Visible', '# print("Caché")\nVisible', 'Rien'],
                correct: 1,
                explanation: 'Les lignes commençant par # sont des commentaires et ne sont pas exécutées.'
              }
            ]
          },
          {
            id: 'py-basics-3',
            title: 'Nombres et Maths',
            icon: '➗',
            xpReward: 15,
            exercises: [
              {
                type: 'mcq',
                question: 'Quel est le résultat de : 10 // 3',
                options: ['3.33', '3', '4', '1'],
                correct: 1,
                explanation: '// est la division entière en Python. 10 // 3 = 3 (ignore le reste).'
              },
              {
                type: 'mcq',
                question: 'Quel opérateur donne le reste d\'une division ?',
                options: ['/', '//', '%', '**'],
                correct: 2,
                explanation: '% est l\'opérateur modulo. 10 % 3 = 1 car 10 = 3×3 + 1.'
              },
              {
                type: 'fill',
                question: 'Écrivez l\'opérateur pour élever 2 à la puissance 3 :',
                code: 'resultat = 2 ___ 3\nprint(resultat)  # affiche 8',
                answer: '**',
                hint: 'Python utilise un opérateur spécial pour les puissances',
                explanation: '** est l\'opérateur d\'exponentielle. 2 ** 3 = 8.'
              },
              {
                type: 'output',
                question: 'Que va afficher ceci ?',
                code: 'print(15 % 4)',
                options: ['3', '3.75', '4', '1'],
                correct: 0,
                explanation: '15 % 4 = 3 car 15 = 4×3 + 3. Le reste est 3.'
              }
            ]
          }
        ]
      },
      {
        id: 'py-variables',
        title: 'Variables et Types',
        icon: '📦',
        color: '#8b5cf6',
        xpReward: 25,
        lessons: [
          {
            id: 'py-vars-1',
            title: 'Créer des Variables',
            icon: '🏷️',
            xpReward: 10,
            exercises: [
              {
                type: 'mcq',
                question: 'Quel nom de variable est valide en Python ?',
                options: ['2nom', 'mon-nom', 'mon_nom', 'mon nom'],
                correct: 2,
                explanation: 'Les noms de variables ne peuvent pas commencer par un nombre, ni contenir de tirets ou d\'espaces. Les tirets du bas _ sont autorisés.'
              },
              {
                type: 'fill',
                question: 'Assignez la valeur 42 à une variable appelée "reponse" :',
                code: '___ = 42',
                answer: 'reponse',
                hint: 'Le nom de variable va à gauche du =',
                explanation: 'Les variables sont créées avec la syntaxe nom = valeur. Pas besoin de déclarer le type en Python.'
              },
              {
                type: 'output',
                question: 'Que va afficher ce code ?',
                code: 'x = 5\nx = x + 3\nprint(x)',
                options: ['5', '3', '8', 'Erreur'],
                correct: 2,
                explanation: 'x commence à 5, puis x + 3 = 8 est réassigné à x.'
              },
              {
                type: 'mcq',
                question: 'De quel type est la variable : nom = "Alice"',
                options: ['int', 'float', 'str', 'bool'],
                correct: 2,
                explanation: 'Du texte entre guillemets est une chaîne de caractères (str) en Python.'
              }
            ]
          },
          {
            id: 'py-vars-2',
            title: 'Types de Données',
            icon: '🎲',
            xpReward: 15,
            exercises: [
              {
                type: 'mcq',
                question: 'De quel type est : x = 3.14',
                options: ['int', 'float', 'str', 'double'],
                correct: 1,
                explanation: 'Les nombres avec une virgule (point) sont des floats (flottants) en Python.'
              },
              {
                type: 'mcq',
                question: 'De quel type est : actif = True',
                options: ['string', 'int', 'bool', 'None'],
                correct: 2,
                explanation: 'True et False sont des valeurs booléennes (bool). Notez les majuscules T et F.'
              },
              {
                type: 'fill',
                question: 'Obtenez le type d\'une variable :',
                code: 'x = 42\nprint(___(x))',
                answer: 'type',
                hint: 'Fonction intégrée qui retourne le type d\'une valeur',
                explanation: 'type() returns the data type of any value.'
              },
              {
                type: 'output',
                question: 'Que va afficher ce code ?',
                code: 'x = "5"\ny = 5\nprint(type(x) == type(y))',
                options: ['True', 'False', 'Error', 'None'],
                correct: 1,
                explanation: '"5" est une chaîne de caractères (str) et 5 est un entier (int) — ce sont des types différents, donc la comparaison est Faux.'
              }
            ]
          },
          {
            id: 'py-vars-3',
            title: 'String Operations',
            icon: '🔗',
            xpReward: 15,
            exercises: [
              {
                type: 'mcq',
                question: 'What is string concatenation?',
                options: ['Splitting a string', 'Joining strings together', 'Converting to uppercase', 'Finding string length'],
                correct: 1,
                explanation: 'Concatenation means joining strings together, done with the + operator.'
              },
              {
                type: 'output',
                question: 'What does this print?',
                code: 'first = "Code"\nlast = "Lingo"\nprint(first + " " + last)',
                options: ['CodeLingo', 'Code Lingo', 'first last', 'Error'],
                correct: 1,
                explanation: 'Strings are joined with +. A space " " is added between them.'
              },
              {
                type: 'fill',
                question: 'Get the length of a string:',
                code: 'word = "Python"\nprint(___(word))  # prints 6',
                answer: 'len',
                hint: 'Short for "length"',
                explanation: 'len() returns the number of characters in a string.'
              },
              {
                type: 'output',
                question: 'What does this print?',
                code: 'name = "codelingo"\nprint(name.upper())',
                options: ['codelingo', 'Codelingo', 'CODELINGO', 'Error'],
                correct: 2,
                explanation: '.upper() converts all characters in a string to uppercase.'
              }
            ]
          }
        ]
      },
      {
        id: 'py-control',
        title: 'Control Flow',
        icon: '🔛',
        color: '#f59e0b',
        xpReward: 30,
        lessons: [
          {
            id: 'py-if-1',
            title: 'If Statements',
            icon: '❓',
            xpReward: 15,
            exercises: [
              {
                type: 'mcq',
                question: 'What keyword starts a conditional block in Python?',
                options: ['when', 'if', 'check', 'cond'],
                correct: 1,
                explanation: '"if" is the keyword for conditional statements in Python.'
              },
              {
                type: 'output',
                question: 'What does this print?',
                code: 'x = 10\nif x > 5:\n    print("Big")\nelse:\n    print("Small")',
                options: ['Big', 'Small', 'Big\nSmall', 'Error'],
                correct: 0,
                explanation: '10 > 5 is True, so "Big" is printed. The else block is skipped.'
              },
              {
                type: 'fill',
                question: 'Complete the condition to check if x equals 10:',
                code: 'x = 10\nif x ___ 10:\n    print("Ten!")',
                answer: '==',
                hint: 'Equality check uses two equals signs',
                explanation: '== checks if two values are equal. = is assignment, == is comparison.'
              },
              {
                type: 'mcq',
                question: 'What does "elif" mean in Python?',
                options: ['else if', 'end if', 'else loop', 'exit if'],
                correct: 0,
                explanation: '"elif" is short for "else if" — used for multiple conditions.'
              }
            ]
          },
          {
            id: 'py-loops-1',
            title: 'For Loops',
            icon: '🔄',
            xpReward: 15,
            exercises: [
              {
                type: 'output',
                question: 'How many times does this loop run?',
                code: 'for i in range(5):\n    print(i)',
                options: ['4 times', '5 times', '6 times', '1 time'],
                correct: 1,
                explanation: 'range(5) generates 0, 1, 2, 3, 4 — that\'s 5 numbers.'
              },
              {
                type: 'fill',
                question: 'Complete the loop to print each fruit:',
                code: 'fruits = ["apple", "banana", "cherry"]\nfor ___ in fruits:\n    print(fruit)',
                answer: 'fruit',
                hint: 'The loop variable holds each item',
                explanation: 'The variable after "for" holds each item in the list on each iteration.'
              },
              {
                type: 'output',
                question: 'What does this print?',
                code: 'total = 0\nfor n in range(1, 4):\n    total += n\nprint(total)',
                options: ['3', '6', '10', '4'],
                correct: 1,
                explanation: 'range(1, 4) gives 1, 2, 3. 1+2+3 = 6.'
              }
            ]
          }
        ]
      },
      {
        id: 'py-functions',
        title: 'Functions',
        icon: '🛠️',
        color: '#ec4899',
        xpReward: 35,
        lessons: [
          {
            id: 'py-func-1',
            title: 'Defining Functions',
            icon: '🔧',
            xpReward: 20,
            exercises: [
              {
                type: 'mcq',
                question: 'Which keyword defines a function in Python?',
                options: ['function', 'func', 'def', 'define'],
                correct: 2,
                explanation: '"def" is Python\'s keyword for defining functions.'
              },
              {
                type: 'fill',
                question: 'Define a function called "greet":',
                code: '___ greet():\n    print("Hello!")',
                answer: 'def',
                hint: 'Think: "define"',
                explanation: 'def introduces a function definition. It\'s followed by the function name and parentheses.'
              },
              {
                type: 'output',
                question: 'What does this print?',
                code: 'def add(a, b):\n    return a + b\n\nresult = add(3, 4)\nprint(result)',
                options: ['7', '34', 'a + b', 'Error'],
                correct: 0,
                explanation: 'add(3, 4) returns 3 + 4 = 7. That value is stored in result and printed.'
              },
              {
                type: 'mcq',
                question: 'What does the "return" keyword do?',
                options: ['Prints a value', 'Ends the program', 'Sends a value back from the function', 'Repeats the function'],
                correct: 2,
                explanation: 'return sends a value back to whoever called the function.'
              }
            ]
          }
        ]
      },
      {
        id: 'py-lists',
        title: 'Lists & Data',
        icon: '📚',
        color: '#06b6d4',
        xpReward: 40,
        lessons: [
          {
            id: 'py-list-1',
            title: 'Working with Lists',
            icon: '📝',
            xpReward: 20,
            exercises: [
              {
                type: 'mcq',
                question: 'How do you access the first item in a list?',
                options: ['list[1]', 'list[0]', 'list.first()', 'list.get(1)'],
                correct: 1,
                explanation: 'Lists are zero-indexed. The first item is at index 0.'
              },
              {
                type: 'fill',
                question: 'Add an item to the end of a list:',
                code: 'items = [1, 2, 3]\nitems.___(4)\nprint(items)  # [1, 2, 3, 4]',
                answer: 'append',
                hint: 'Think: "append" = add to the end',
                explanation: '.append() adds an item to the end of a list.'
              },
              {
                type: 'output',
                question: 'What does this print?',
                code: 'nums = [10, 20, 30, 40]\nprint(nums[-1])',
                options: ['10', '40', '30', 'Error'],
                correct: 1,
                explanation: 'Negative indices count from the end. -1 is the last item, which is 40.'
              },
              {
                type: 'mcq',
                question: 'What does len([1, 2, 3, 4]) return?',
                options: ['3', '4', '5', '[1, 2, 3, 4]'],
                correct: 1,
                explanation: 'len() returns the number of items. There are 4 items in this list.'
              }
            ]
          }
        ]
      },
      {
        id: 'py-dicts',
        title: 'Dictionaries & Sets',
        icon: '💾',
        color: '#f97316',
        xpReward: 40,
        lessons: [
          {
            id: 'py-dict-1',
            title: 'Key-Value Pairs',
            icon: '🔑',
            xpReward: 20,
            exercises: [
              {
                type: 'mcq',
                question: 'Which syntax creates a Python dictionary?',
                options: ['my_dict = []', 'my_dict = ()', 'my_dict = {}', 'my_dict = ""'],
                correct: 2,
                explanation: 'Dictionaries use curly braces {} to store key-value pairs.'
              },
              {
                type: 'fill',
                question: 'Complete the dictionary to map "age" to 25:',
                code: 'user = {"name": "Alice", ___: 25}',
                answer: '"age"',
                hint: 'Keys in dictionaries are usually strings',
                explanation: 'Keys and values are separated by colons. "age": 25 is a valid pair.'
              },
              {
                type: 'output',
                question: 'What does this print?',
                code: 'colors = {"red": "#ff0000", "blue": "#0000ff"}\nprint(colors["red"])',
                options: ['red', '#ff0000', 'blue', 'Error'],
                correct: 1,
                explanation: 'Accessing a dictionary with a key returns its associated value.'
              }
            ]
          },
          {
            id: 'py-dict-2',
            title: 'Dict Methods',
            icon: '🔧',
            xpReward: 20,
            exercises: [
              {
                type: 'mcq',
                question: 'Which method returns a value without crashing if the key is missing?',
                options: ['.fetch()', '.get()', '.find()', '.pop()'],
                correct: 1,
                explanation: '.get(key) returns None (or a default) instead of an error if the key doesn\'t exist.'
              },
              {
                type: 'fill',
                question: 'Get all the keys from a dictionary:',
                code: 'user = {"id": 1, "name": "Bob"}\nall_keys = user.___()',
                answer: 'keys',
                hint: 'The method name is plural',
                explanation: '.keys() returns a view object of all keys in the dictionary.'
              }
            ]
          }
        ]
      },
      {
        id: 'py-project',
        title: 'Mini-Project: Pro',
        icon: '🚀',
        color: '#10b981',
        xpReward: 50,
        lessons: [
          {
            id: 'py-proj-1',
            title: 'Sports Manager',
            icon: '🏆',
            xpReward: 30,
            exercises: [
              {
                type: 'mcq',
                question: 'How would you store team standings using a dictionary?',
                options: ['standings = ["TeamA", 10, "TeamB", 8]', 'standings = {"TeamA": 10, "TeamB": 8}', 'standings = (("TeamA", 10), ("TeamB", 8))', 'standings = "TeamA=10, TeamB=8"'],
                correct: 1,
                explanation: 'Dictionaries are perfect for mapping labels (Team names) to values (Points).'
              },
              {
                type: 'fill',
                question: 'Calculate total points for a team (Win = 3pts):',
                code: 'wins = 5\ntotal = wins ___ 3\nprint(total) # 15',
                answer: '*',
                hint: 'Multiplication operator',
                explanation: 'Total points = Number of wins multiplied by points per win.'
              },
              {
                type: 'output',
                question: 'Translate CodeLingo: What is the output?',
                code: 'stats = {"wins": 2, "draws": 1}\npts = (stats["wins"] * 3) + stats["draws"]\nprint(pts)',
                options: ['3', '6', '7', 'Error'],
                correct: 2,
                explanation: '(2 * 3) + 1 = 7. A classic sports point calculation!'
              }
            ]
          }
        ]
      }
    ]
  },

  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    icon: '🟨',
    color: '#f7df1e',
    accent: '#323330',
    description: 'Build the web with JavaScript',
    units: [
      {
        id: 'js-basics',
        title: 'JS Basics',
        icon: '💡',
        color: '#f59e0b',
        xpReward: 20,
        lessons: [
          {
            id: 'js-basics-1',
            title: 'Hello JavaScript',
            icon: '👋',
            xpReward: 10,
            exercises: [
              {
                type: 'mcq',
                question: 'How do you display a message in the browser console?',
                options: ['print("Hello")', 'echo("Hello")', 'console.log("Hello")', 'display("Hello")'],
                correct: 2,
                explanation: 'console.log() is the standard way to output to the browser\'s developer console.'
              },
              {
                type: 'fill',
                question: 'Complete the code to log "Hello, JS!":',
                code: 'console.___(\"Hello, JS!\")',
                answer: 'log',
                hint: 'The method on console for logging',
                explanation: 'console.log() outputs values to the console. It\'s essential for debugging.'
              },
              {
                type: 'mcq',
                question: 'What does // mean in JavaScript?',
                options: ['Division operator', 'Single-line comment', 'Multi-line comment', 'URL path'],
                correct: 1,
                explanation: '// starts a single-line comment in JavaScript. Anything after it on that line is ignored.'
              },
              {
                type: 'output',
                question: 'What is logged?',
                code: 'console.log(2 + 3);\nconsole.log("2" + "3");',
                options: ['5\n5', '5\n23', '23\n5', '23\n23'],
                correct: 1,
                explanation: '2 + 3 = 5 (numbers). "2" + "3" = "23" (string concatenation).'
              }
            ]
          },
          {
            id: 'js-basics-2',
            title: 'Variables & let/const',
            icon: '📦',
            xpReward: 10,
            exercises: [
              {
                type: 'mcq',
                question: 'Which keyword declares a variable that can\'t be reassigned?',
                options: ['var', 'let', 'const', 'fixed'],
                correct: 2,
                explanation: 'const declares a constant — a variable that cannot be reassigned after declaration.'
              },
              {
                type: 'fill',
                question: 'Declare a variable that can change:',
                code: '___ score = 0;\nscore = 10;',
                answer: 'let',
                hint: 'Modern JS keyword for reassignable variables',
                explanation: 'let declares a block-scoped variable that can be reassigned.'
              },
              {
                type: 'output',
                question: 'What is logged?',
                code: 'let x = 5;\nlet y = x;\ny = 10;\nconsole.log(x);',
                options: ['5', '10', 'undefined', 'Error'],
                correct: 0,
                explanation: 'Assigning y = x copies the value, not a reference. Changing y doesn\'t affect x.'
              },
              {
                type: 'mcq',
                question: 'What is wrong with this code?\nconst name = "Alice";\nname = "Bob";',
                options: ['Nothing is wrong', 'Missing semicolons', 'Cannot reassign a const', 'Wrong quotes'],
                correct: 2,
                explanation: 'const variables cannot be reassigned. This would throw a TypeError.'
              }
            ]
          },
          {
            id: 'js-basics-3',
            title: 'Data Types',
            icon: '🎲',
            xpReward: 10,
            exercises: [
              {
                type: 'mcq',
                question: 'What type is: typeof "hello"',
                options: ['"text"', '"string"', '"str"', '"char"'],
                correct: 1,
                explanation: 'typeof "hello" returns "string". All text values are strings.'
              },
              {
                type: 'output',
                question: 'What is logged?',
                code: 'console.log(typeof 42);\nconsole.log(typeof true);',
                options: ['"int"\n"bool"', '"number"\n"boolean"', '"float"\n"bool"', '"num"\n"boolean"'],
                correct: 1,
                explanation: 'typeof 42 is "number" and typeof true is "boolean" in JavaScript.'
              },
              {
                type: 'mcq',
                question: 'What is the value of: undefined == null',
                options: ['true', 'false', 'Error', '"undefined"'],
                correct: 0,
                explanation: 'With loose equality (==), undefined == null is true. Both represent "no value".'
              }
            ]
          }
        ]
      },
      {
        id: 'js-functions',
        title: 'Functions',
        icon: '⚡',
        color: '#8b5cf6',
        xpReward: 25,
        lessons: [
          {
            id: 'js-func-1',
            title: 'Function Basics',
            icon: '🔧',
            xpReward: 15,
            exercises: [
              {
                type: 'mcq',
                question: 'Which is a correct function declaration?',
                options: ['func greet() {}', 'def greet() {}', 'function greet() {}', 'fn greet() {}'],
                correct: 2,
                explanation: 'JavaScript uses the "function" keyword to declare functions.'
              },
              {
                type: 'fill',
                question: 'Complete the arrow function:',
                code: 'const double = (n) ___ n * 2;',
                answer: '=>',
                hint: 'Arrow functions use this operator',
                explanation: '=> creates an arrow function. (n) => n * 2 is equivalent to function(n) { return n * 2; }.'
              },
              {
                type: 'output',
                question: 'What is logged?',
                code: 'function square(n) {\n  return n * n;\n}\nconsole.log(square(4));',
                options: ['4', '8', '16', 'n * n'],
                correct: 2,
                explanation: 'square(4) returns 4 * 4 = 16.'
              },
              {
                type: 'mcq',
                question: 'What does an arrow function with no curly braces return?',
                options: ['undefined', 'null', 'The expression result implicitly', 'An error'],
                correct: 2,
                explanation: 'Arrow functions without {} have an implicit return — they return the expression value directly.'
              }
            ]
          },
          {
            id: 'js-func-2',
            title: 'Callbacks',
            icon: '📞',
            xpReward: 15,
            exercises: [
              {
                type: 'mcq',
                question: 'What is a callback function?',
                options: ['A function that calls itself', 'A function passed as an argument', 'A function with no return', 'An async function'],
                correct: 1,
                explanation: 'A callback is a function passed as an argument to another function, to be called later.'
              },
              {
                type: 'output',
                question: 'What is logged?',
                code: '[1,2,3].forEach(n => console.log(n * 2));',
                options: ['1\n2\n3', '2\n4\n6', '[2,4,6]', '6'],
                correct: 1,
                explanation: 'forEach calls the callback for each element. 1*2=2, 2*2=4, 3*2=6, each logged separately.'
              }
            ]
          }
        ]
      },
      {
        id: 'js-arrays',
        title: 'Arrays',
        icon: '📋',
        color: '#22c55e',
        xpReward: 30,
        lessons: [
          {
            id: 'js-array-1',
            title: 'Array Fundamentals',
            icon: '🗂️',
            xpReward: 15,
            exercises: [
              {
                type: 'mcq',
                question: 'How do you add an item to the end of an array?',
                options: ['arr.add(x)', 'arr.push(x)', 'arr.append(x)', 'arr.insert(x)'],
                correct: 1,
                explanation: '.push() adds an element to the end of an array and returns the new length.'
              },
              {
                type: 'fill',
                question: 'Get the number of items in an array:',
                code: 'const arr = [1, 2, 3, 4];\nconsole.log(arr.___); // 4',
                answer: 'length',
                hint: 'Array property (not a function call)',
                explanation: '.length is a property (not a method) that returns the number of elements.'
              },
              {
                type: 'output',
                question: 'What is logged?',
                code: 'const nums = [10, 20, 30];\nconsole.log(nums.map(n => n * 2));',
                options: ['[10, 20, 30]', '[20, 40, 60]', '[2, 4, 6]', 'Error'],
                correct: 1,
                explanation: '.map() creates a new array with each element transformed. 10*2=20, 20*2=40, 30*2=60.'
              },
              {
                type: 'mcq',
                question: 'Which method creates a NEW array with only matching elements?',
                options: ['.find()', '.filter()', '.map()', '.reduce()'],
                correct: 1,
                explanation: '.filter() returns a new array with only elements that pass the test function.'
              }
            ]
          }
        ]
      },
      {
        id: 'js-dom',
        title: 'DOM Basics',
        icon: '🌐',
        color: '#ef4444',
        xpReward: 35,
        lessons: [
          {
            id: 'js-dom-1',
            title: 'Selecting Elements',
            icon: '🎯',
            xpReward: 20,
            exercises: [
              {
                type: 'mcq',
                question: 'Which method selects an element by its ID?',
                options: ['document.getElement("id")', 'document.getElementById("id")', 'document.find("#id")', 'document.select("id")'],
                correct: 1,
                explanation: 'getElementById() selects a single element by its id attribute.'
              },
              {
                type: 'fill',
                question: 'Select an element using a CSS selector:',
                code: 'const btn = document.___(".my-button");',
                answer: 'querySelector',
                hint: 'Accepts any CSS selector',
                explanation: 'querySelector() selects the first element matching a CSS selector.'
              },
              {
                type: 'output',
                question: 'What does this do?',
                code: 'document.querySelector("h1").textContent = "Hi!";',
                options: ['Logs "Hi!" to console', 'Changes the h1 text to "Hi!"', 'Creates a new h1', 'Deletes the h1'],
                correct: 1,
                explanation: 'textContent changes the text inside the selected element.'
              }
            ]
          }
        ]
      },
      {
        id: 'js-async',
        title: 'Async JS',
        icon: '⏳',
        color: '#06b6d4',
        xpReward: 40,
        lessons: [
          {
            id: 'js-async-1',
            title: 'Promises',
            icon: '🤝',
            xpReward: 20,
            exercises: [
              {
                type: 'mcq',
                question: 'What does a Promise represent?',
                options: ['A function', 'A value available now or in the future', 'A type of loop', 'A way to declare variables'],
                correct: 1,
                explanation: 'A Promise represents an operation that hasn\'t completed yet but will in the future.'
              },
              {
                type: 'mcq',
                question: 'Which keyword waits for a Promise to resolve?',
                options: ['wait', 'pause', 'await', 'hold'],
                correct: 2,
                explanation: '"await" pauses execution until the Promise resolves, used inside async functions.'
              },
              {
                type: 'fill',
                question: 'Mark a function as asynchronous:',
                code: '___ function fetchData() {\n  const data = await getFromServer();\n}',
                answer: 'async',
                hint: 'The keyword that enables await inside a function',
                explanation: '"async" makes a function asynchronous, allowing the use of "await" inside it.'
              }
            ]
          }
        ]
      }
    ]
  },

  html_css: {
    id: 'html_css',
    name: 'HTML/CSS',
    icon: '🕸️',
    color: '#e34c26',
    accent: '#264de4',
    description: 'Build beautiful websites from scratch',
    units: [
      {
        id: 'hc-basics',
        title: 'HTML Basics',
        icon: '📄',
        color: '#f97316',
        xpReward: 20,
        lessons: [
          {
            id: 'hc-basics-1',
            title: 'Your First Webpage',
            icon: '🌍',
            xpReward: 10,
            exercises: [
              {
                type: 'mcq',
                question: 'What does HTML stand for?',
                options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyperlink Text Module Language', 'Home Tool Markup Language'],
                correct: 0,
                explanation: 'HTML defines the structure and content of a web page.'
              },
              {
                type: 'fill',
                question: 'Complete the tag to create a main heading:',
                code: '<___>Welcome</___>',
                answer: 'h1',
                hint: 'Heading level 1',
                explanation: '<h1> is the largest and most important heading tag in HTML.'
              },
              {
                type: 'output',
                question: 'What does this HTML create?',
                code: '<p>Hello <strong>World</strong></p>',
                options: ['A link to World', 'A paragraph with "World" bolded', 'A new window', 'An image'],
                correct: 1,
                explanation: 'The <p> tag creates a paragraph, and <strong> makes the text inside it bold.'
              }
            ]
          },
          {
            id: 'hc-basics-2',
            title: 'Links & Images',
            icon: '🖼️',
            xpReward: 15,
            exercises: [
              {
                type: 'fill',
                question: 'To create a hyperlink, use the "href" attribute inside which tag?',
                code: '<___ href="https://google.com">Search</___>',
                answer: 'a',
                hint: 'Short for "anchor"',
                explanation: 'The <a> (anchor) tag creates a clickable link.'
              },
              {
                type: 'mcq',
                question: 'Which tag is correct for displaying an image?',
                options: ['<image src="cat.jpg">', '<img src="cat.jpg" />', '<picture href="cat.jpg">', '<src="cat.jpg">'],
                correct: 1,
                explanation: 'The <img> tag is empty (no closing tag) and uses "src" (source) to point to the image.'
              }
            ]
          }
        ]
      },
      {
        id: 'hc-css',
        title: 'CSS Styling',
        icon: '🎨',
        color: '#3b82f6',
        xpReward: 30,
        lessons: [
          {
            id: 'hc-css-1',
            title: 'Adding Colors',
            icon: '🖌️',
            xpReward: 15,
            exercises: [
              {
                type: 'fill',
                question: 'Make the text color red in CSS:',
                code: 'h1 {\n  ___: red;\n}',
                answer: 'color',
                hint: 'The property for text color',
                explanation: 'The "color" property changes the text color of an element.'
              },
              {
                type: 'mcq',
                question: 'How do you select an element with id="main" in CSS?',
                options: ['.main', '*main', '#main', 'main'],
                correct: 2,
                explanation: 'The # symbol is used to select elements by their ID in CSS.'
              },
              {
                type: 'mcq',
                question: 'How do you select elements with class="btn" in CSS?',
                options: ['.btn', '#btn', 'btn', '*btn'],
                correct: 0,
                explanation: 'The . (dot) symbol is used to select elements by their class name.'
              }
            ]
          }
        ]
      }
    ]
  }
};

window.COURSES = COURSES;
