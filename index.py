# ============================================================
#  Gestion d'une compétition sportive en Python — Mode interactif
# ============================================================

from datetime import date


# ─────────────────────────────────────────────
# Classes métier
# ─────────────────────────────────────────────

class Poste:
    def __init__(self, nom: str, description: str):
        self.nom = nom
        self.description = description

    def __str__(self):
        return f"{self.nom} ({self.description})"


class Joueur:
    def __init__(self, nom, prenoms, nationalite, taille, poids, pied_fort, poste):
        self.nom         = nom
        self.prenoms     = prenoms
        self.nationalite = nationalite
        self.taille      = taille
        self.poids       = poids
        self.pied_fort   = pied_fort
        self.poste       = poste

    def __str__(self):
        return (f"{self.prenoms} {self.nom.upper()} | {self.nationalite} | "
                f"Poste : {self.poste.nom} | {self.taille} cm / {self.poids} kg | "
                f"Pied : {self.pied_fort}")


class Equipe:
    def __init__(self, nom: str, drapeau: str):
        self.nom     = nom
        self.drapeau = drapeau
        self.joueurs = []

    def ajouter_joueur(self, joueur):
        self.joueurs.append(joueur)

    def __str__(self):
        return f"{self.drapeau}  {self.nom}  ({len(self.joueurs)} joueur(s))"


class Match:
    def __init__(self, equipe1, equipe2):
        self.equipe1   = equipe1
        self.equipe2   = equipe2
        self.score     = None
        self.vainqueur = None

    def enregistrer_score(self, b1: int, b2: int):
        self.score = (b1, b2)
        if b1 > b2:
            self.vainqueur = self.equipe1
        elif b2 > b1:
            self.vainqueur = self.equipe2
        else:
            self.vainqueur = None

    def __str__(self):
        if self.score is None:
            res = "non joué"
        else:
            v = self.vainqueur.nom if self.vainqueur else "Nul"
            res = f"{self.score[0]}-{self.score[1]}  ({v})"
        return f"{self.equipe1.nom}  vs  {self.equipe2.nom}  →  {res}"


class Competition:
    def __init__(self, nom, description, date_debut, date_fin):
        self.nom         = nom
        self.description = description
        self.date_debut  = date_debut
        self.date_fin    = date_fin
        self.equipes     = []
        self.matchs      = []

    def ajouter_equipe(self, equipe):
        self.equipes.append(equipe)

    def ajouter_match(self, match):
        self.matchs.append(match)

    def afficher_classement(self):
        stats = {e.nom: {"V": 0, "N": 0, "D": 0} for e in self.equipes}
        for m in self.matchs:
            if m.score is None:
                continue
            if m.vainqueur is None:
                stats[m.equipe1.nom]["N"] += 1
                stats[m.equipe2.nom]["N"] += 1
            else:
                stats[m.vainqueur.nom]["V"] += 1
                perdant = m.equipe2 if m.vainqueur == m.equipe1 else m.equipe1
                stats[perdant.nom]["D"] += 1

        ligne = "─" * 52
        print(f"\n{ligne}")
        print(f"  CLASSEMENT — {self.nom}")
        print(f"{ligne}")
        print(f"  {'Équipe':<22} {'V':>4} {'N':>4} {'D':>4}  {'Pts':>4}")
        print(f"{ligne}")
        classement = sorted(stats.items(),
                            key=lambda x: x[1]["V"] * 3 + x[1]["N"],
                            reverse=True)
        for nom, s in classement:
            pts = s["V"] * 3 + s["N"]
            print(f"  {nom:<22} {s['V']:>4} {s['N']:>4} {s['D']:>4}  {pts:>4}")
        print(f"{ligne}\n")

    def __str__(self):
        return (f"  Nom         : {self.nom}\n"
                f"  Description : {self.description}\n"
                f"  Période     : {self.date_debut} → {self.date_fin}\n"
                f"  Équipes     : {len(self.equipes)}\n"
                f"  Matchs      : {len(self.matchs)}")


# ─────────────────────────────────────────────
# Helpers de saisie
# ─────────────────────────────────────────────

def saisir_texte(invite: str, obligatoire: bool = True) -> str:
    while True:
        valeur = input(invite).strip()
        if valeur or not obligatoire:
            return valeur
        print("  ⚠  Ce champ est obligatoire.")


def saisir_entier(invite: str, mini: int = None, maxi: int = None) -> int:
    while True:
        try:
            v = int(input(invite))
            if (mini is not None and v < mini) or (maxi is not None and v > maxi):
                borne = f"entre {mini} et {maxi}" if maxi else f">= {mini}"
                print(f"  ⚠  Veuillez entrer un nombre {borne}.")
            else:
                return v
        except ValueError:
            print("  ⚠  Veuillez entrer un nombre entier valide.")


def saisir_flottant(invite: str, mini: float = None) -> float:
    while True:
        try:
            v = float(input(invite))
            if mini is not None and v < mini:
                print(f"  ⚠  La valeur doit être >= {mini}.")
            else:
                return v
        except ValueError:
            print("  ⚠  Veuillez entrer un nombre valide.")


def saisir_date(invite: str) -> str:
    while True:
        v = input(invite).strip()
        try:
            date.fromisoformat(v)
            return v
        except ValueError:
            print("  ⚠  Format attendu : AAAA-MM-JJ (ex: 2025-07-01).")


def choisir_dans_liste(liste, libelle: str, afficheur=str):
    if not liste:
        print(f"  ⚠  Aucun(e) {libelle} disponible.")
        return None
    for i, elem in enumerate(liste, 1):
        print(f"    {i}. {afficheur(elem)}")
    choix = saisir_entier(f"  Votre choix (1-{len(liste)}) : ", 1, len(liste))
    return liste[choix - 1]


def titre(texte: str):
    print(f"\n{'═' * 52}")
    print(f"  {texte}")
    print(f"{'═' * 52}")


def sous_titre(texte: str):
    print(f"\n── {texte} ──")


# ─────────────────────────────────────────────
# Postes prédéfinis
# ─────────────────────────────────────────────

POSTES_DEFAUT = [
    Poste("Gardien",   "Protège le but de l'équipe"),
    Poste("Défenseur", "Empêche les attaques adverses"),
    Poste("Milieu",    "Assure la transition attaque/défense"),
    Poste("Attaquant", "Marque des buts"),
]


# ─────────────────────────────────────────────
# Actions du menu
# ─────────────────────────────────────────────

def creer_competition():
    sous_titre("Nouvelle compétition")
    nom         = saisir_texte("  Nom de la compétition : ")
    description = saisir_texte("  Description           : ")
    debut       = saisir_date ("  Date de début (AAAA-MM-JJ) : ")
    fin         = saisir_date ("  Date de fin   (AAAA-MM-JJ) : ")
    comp = Competition(nom, description, debut, fin)
    print(f"\n  ✔  Compétition « {nom} » créée avec succès !")
    return comp


def creer_equipe(competition):
    sous_titre("Nouvelle équipe")
    nom     = saisir_texte("  Nom de l'équipe : ")
    drapeau = saisir_texte("  Drapeau (emoji, ex: 🇨🇮) : ", obligatoire=False) or "🏳"
    equipe  = Equipe(nom, drapeau)
    competition.ajouter_equipe(equipe)
    print(f"  ✔  Équipe « {nom} » ajoutée à la compétition.")


def creer_joueur(competition, postes):
    if not competition.equipes:
        print("  ⚠  Créez d'abord au moins une équipe.")
        return

    sous_titre("Nouveau joueur")
    nom         = saisir_texte("  Nom           : ")
    prenoms     = saisir_texte("  Prénoms        : ")
    nationalite = saisir_texte("  Nationalité    : ")
    taille      = saisir_flottant("  Taille (cm)    : ", mini=100)
    poids       = saisir_flottant("  Poids (kg)     : ", mini=30)

    while True:
        pied = input("  Pied fort (D=droit / G=gauche) : ").strip().upper()
        if pied in ("D", "G"):
            pied_fort = "Droit" if pied == "D" else "Gauche"
            break
        print("  ⚠  Entrez D ou G.")

    print("  Choisissez un poste :")
    poste = choisir_dans_liste(postes, "poste")
    if poste is None:
        return

    joueur = Joueur(nom, prenoms, nationalite, taille, poids, pied_fort, poste)

    print("  Choisissez l'équipe :")
    equipe = choisir_dans_liste(competition.equipes, "équipe")
    if equipe is None:
        return

    equipe.ajouter_joueur(joueur)
    print(f"  ✔  {prenoms} {nom} ajouté(e) à l'équipe « {equipe.nom} ».")


def creer_match(competition):
    if len(competition.equipes) < 2:
        print("  ⚠  Il faut au moins 2 équipes pour créer un match.")
        return

    sous_titre("Nouveau match")
    print("  Équipe 1 :")
    eq1 = choisir_dans_liste(competition.equipes, "équipe")
    if eq1 is None:
        return

    autres = [e for e in competition.equipes if e != eq1]
    print("  Équipe 2 :")
    eq2 = choisir_dans_liste(autres, "équipe")
    if eq2 is None:
        return

    match = Match(eq1, eq2)

    rep = input("  Saisir le score maintenant ? (o/n) : ").strip().lower()
    if rep == "o":
        b1 = saisir_entier(f"  Buts de {eq1.nom} : ", mini=0)
        b2 = saisir_entier(f"  Buts de {eq2.nom} : ", mini=0)
        match.enregistrer_score(b1, b2)

    competition.ajouter_match(match)
    print(f"  ✔  Match ajouté : {match}")


def saisir_score_match(competition):
    matchs_sans_score = [m for m in competition.matchs if m.score is None]
    if not matchs_sans_score:
        print("  ✔  Tous les matchs ont déjà un score.")
        return

    sous_titre("Enregistrer un score")
    print("  Choisissez le match :")
    match = choisir_dans_liste(matchs_sans_score, "match")
    if match is None:
        return

    b1 = saisir_entier(f"  Buts de {match.equipe1.nom} : ", mini=0)
    b2 = saisir_entier(f"  Buts de {match.equipe2.nom} : ", mini=0)
    match.enregistrer_score(b1, b2)
    print(f"  ✔  Score enregistré : {match}")


def afficher_equipes(competition):
    sous_titre("Équipes et joueurs")
    if not competition.equipes:
        print("  Aucune équipe enregistrée.")
        return
    for equipe in competition.equipes:
        print(f"\n  {equipe}")
        if equipe.joueurs:
            for j in equipe.joueurs:
                print(f"    • {j}")
        else:
            print("    (aucun joueur)")


def afficher_matchs(competition):
    sous_titre("Matchs")
    if not competition.matchs:
        print("  Aucun match enregistré.")
        return
    for i, m in enumerate(competition.matchs, 1):
        print(f"  {i}. {m}")


# ─────────────────────────────────────────────
# Menu principal
# ─────────────────────────────────────────────

def menu_principal(competition, postes):
    options = [
        ("Créer une équipe",                lambda: creer_equipe(competition)),
        ("Ajouter un joueur",               lambda: creer_joueur(competition, postes)),
        ("Ajouter un match",                lambda: creer_match(competition)),
        ("Enregistrer un score",            lambda: saisir_score_match(competition)),
        ("Afficher les équipes / joueurs",  lambda: afficher_equipes(competition)),
        ("Afficher les matchs",             lambda: afficher_matchs(competition)),
        ("Afficher le classement",          lambda: competition.afficher_classement()),
        ("Infos compétition",               lambda: print(f"\n{competition}")),
        ("Quitter",                         None),
    ]

    while True:
        titre(f"MENU — {competition.nom}")
        for i, (label, _) in enumerate(options, 1):
            print(f"  {i}. {label}")

        choix = saisir_entier(f"\n  Votre choix (1-{len(options)}) : ", 1, len(options))
        action = options[choix - 1][1]

        if action is None:
            print("\n  Au revoir ! 👋\n")
            break
        action()


# ─────────────────────────────────────────────
# Point d'entrée
# ─────────────────────────────────────────────

if __name__ == "__main__":
    titre("GESTION D'UNE COMPÉTITION SPORTIVE")
    print("  Bienvenue ! Commençons par créer votre compétition.\n")
    competition = creer_competition()
    menu_principal(competition, POSTES_DEFAUT)