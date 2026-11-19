"use strict";

const COURSE = [
  {
    id: "identites",
    title: "Qui suis-je ?",
    theme: "Identités",
    reference: "Chapitre 1A · Qui suis-je ? (p. 8 et suivantes)",
    description: "Décrivez votre personnalité et réfléchissez à l’image que vous montrez aux autres.",
    goal: "Présenter une expérience personnelle et justifier un choix.",
    image: "assets/cour.webp",
    alt: "Deux élèves discutent avec leurs sacs dans la cour d’un lycée.",
    vocab: [["réservé(e)", "quiet or reserved"], ["faire partie de", "to be a member of"], ["se présenter", "to introduce oneself"], ["tenir à", "to care about"], ["partager", "to share"], ["ce qui me représente", "what represents me"]],
    reading: {
      title: "Deux portraits, une même personne",
      text: [
        "Au début de l’année, Malik parlait peu au lycée. Pourtant, au club photo, il discutait facilement avec les autres. Un samedi, sa classe a préparé une exposition intitulée « Ce qui nous représente ». Chaque élève devait choisir une photo et écrire une légende.",
        "Malik a choisi une image du marché de son quartier. La photo ne montrait pas son visage. On y voyait les mains de sa grand-mère, qui choisissait des oranges. Malik a expliqué à ses camarades qu’il allait au marché avec elle depuis son enfance et que cette habitude comptait beaucoup pour lui.",
        "Sur le site du lycée, la classe a publié les photos et les légendes, avec l’accord des élèves. Malik a demandé qu’on utilise seulement son prénom. Il voulait partager son histoire sans donner trop d’informations personnelles. Après l’exposition, une camarade lui a dit : « Maintenant, je comprends pourquoi tu prends toujours ton appareil photo. »"
      ],
      evidence: "Relevez un détail qui montre que l’identité de Malik se construit aussi à travers ses liens familiaux.",
      modelEvidence: "Par exemple, il va au marché avec sa grand-mère depuis son enfance. Il photographie leurs habitudes communes et choisit ce souvenir pour représenter une partie de son identité.",
      questions: [
        ["Quel contraste présente le premier paragraphe ?", ["Il aime le marché mais déteste le lycée.", "Il parle peu au lycée mais s’exprime facilement au club photo.", "Il préfère écrire une légende pour la photo de quelqu’un d’autre."], 1, "Au lycée, Malik parle peu. Au club photo, il discute facilement."],
        ["Dans « cette habitude comptait beaucoup pour lui », quelle est l’habitude ?", ["Aller au marché avec sa grand-mère.", "Prendre des photos seulement le samedi.", "Montrer son visage en public."], 0, "La phrase précédente précise qu’il va au marché avec sa grand-mère depuis son enfance."],
        ["Pourquoi demande-t-il que seul son prénom soit publié ?", ["Pour donner la photo à un autre élève.", "Parce que la légende est trop longue.", "Pour raconter son histoire tout en protégeant sa vie privée."], 2, "Il accepte de partager son expérience, mais fixe une limite aux informations personnelles."],
        ["Quel titre résume le mieux le dernier paragraphe ?", ["Se montrer sans tout dévoiler", "Un concours photo difficile", "Un site réservé aux adultes"], 0, "Le paragraphe porte sur ce que Malik accepte ou choisit de garder privé."]
      ]
    },
    listening: {
      title: "Un message avant l’exposition",
      audio: "assets/exposition.mp3",
      transcript: "Salut, c’est Camille. Pour l’exposition de jeudi, j’ai d’abord choisi une photo de mon équipe de basket. Mais deux personnes préfèrent que leur visage ne soit pas publié. Alors j’ai pris une nouvelle photo : on voit le ballon et nos chaussures, mais personne n’est reconnaissable. Ça raconte quand même quelque chose sur moi, parce que je passe tous mes mercredis avec cette équipe. Le professeur veut que je lui envoie la légende mardi soir. Je peux garder ma photo jusqu’à jeudi matin, mais le texte doit arriver plus tôt. Et toi, tu as trouvé une image qui te représente ?",
      questions: [
        ["Pourquoi Camille a-t-elle changé de photo ?", ["L’équipe a perdu le match.", "Deux personnes veulent garder leur visage privé.", "Le professeur refuse les photos de sport."], 1, "Deux personnes préfèrent que leur visage ne soit pas publié."],
        ["Que veut-il recevoir mardi soir ?", ["La légende.", "Le ballon.", "La photo imprimée."], 0, "Camille doit envoyer le texte mardi soir. La photo peut attendre jeudi."],
        ["Que signifie « quand même » dans le message ?", ["La photo ne dit plus rien sur elle.", "La nouvelle photo sera publiée sans accord.", "Malgré le changement, la photo la représente toujours."], 2, "Même sans visages visibles, le ballon et les chaussures représentent son lien avec l’équipe."],
        ["Quelle est la dernière intention de Camille ?", ["Demander un report.", "Inviter son camarade à parler de son propre choix.", "Se retirer de l’exposition."], 1, "Elle demande à son camarade s’il a trouvé une image qui le représente."]
      ]
    },
    writing: {
      title: "Faut-il tout montrer pour être soi-même ?",
      format: "Message sur un forum",
      alternatives: ["Compte rendu", "Lettre de réclamation"],
      prompt: "Le forum du lycée ouvre une discussion sur l’identité en ligne. Racontez une situation où vous avez choisi de partager ou de garder privé un détail personnel. Expliquez votre choix et invitez les autres élèves à répondre.",
      points: ["Donnez un titre et adressez-vous aux autres élèves.", "Racontez la situation et expliquez la raison de votre choix.", "Nuancez votre avis, puis posez une question ouverte."],
      structure: ["Titre qui lance la discussion", "Salutation au groupe", "Expérience et raison du choix", "Avis nuancé et question au groupe"],
      starter: "Titre : [Votre titre]\n\nSalut à toutes et à tous,\n\n[Votre expérience et votre choix]\n\n[Votre avis, avec une nuance]\n\n[Une question pour lancer la discussion]",
      model: "Titre : Une photo peut-elle tout dire ?\n\nSalut à toutes et à tous,\n\nJ’aime partager mes dessins, mais je garde certains détails de ma vie privée. La semaine dernière, j’ai publié un dessin de mon quartier sans préciser où j’habite. J’ai fait ce choix parce que je voulais parler du quartier sans donner mon adresse.\n\nMême si j’apprécie les échanges en ligne, je préfère choisir ce que je montre. Et vous, avez-vous déjà changé une publication avant de la partager ? Pourquoi ?",
      register: "Un ton personnel et ouvert. Le titre et la question finale aident les autres élèves à participer.",
      notes: ["logique", "concession"]
    },
    speaking: {
      title: "Appartenir à un groupe",
      prompts: ["Décrivez le lieu, les élèves et un détail visible. Appuyez votre interprétation sur ce détail.", "Reliez la scène au thème Identités : que peut révéler l’appartenance à un groupe ?", "Comparez avec une situation scolaire dans un contexte francophone que vous avez étudié."],
      follow: ["Vous comportez-vous de la même manière avec tous vos groupes d’amis ? Pourquoi ?", "Quel objet ou quelle activité dit quelque chose sur votre identité ?"],
      extra: ["Expériences · Racontez une activité qui vous a permis de rencontrer quelqu’un.", "Ingéniosité humaine · Les réseaux sociaux facilitent-ils les échanges entre élèves ?"]
    }
  },
  {
    id: "bien-etre",
    title: "Trouver son équilibre",
    theme: "Identités · Bien-être",
    reference: "Chapitre 1B · Bien-être",
    description: "Analysez une initiative pour améliorer la vie au lycée, puis proposez des pistes concrètes.",
    goal: "Distinguer observation, interprétation et recommandation dans un texte structuré.",
    image: "assets/pause.webp",
    alt: "Des élèves prennent une pause dans une cour arborée, près d’un banc.",
    vocab: [["une pause", "a break"], ["les habitudes", "habits"], ["un sondage", "a survey"], ["hors connexion", "offline"], ["une amélioration", "an improvement"], ["le sommeil", "sleep"]],
    reading: {
      title: "Une pause sans écran au lycée",
      text: [
        "Dans un lycée de Bruxelles, le conseil des élèves a testé une table sans téléphone à la cantine. Pendant deux semaines, les élèves qui le voulaient pouvaient s’installer à cette table. Un petit panneau invitait à laisser les téléphones dans les sacs. Des cartes proposaient des sujets de conversation.",
        "Un sondage fictif mené auprès des 40 participants a montré que 25 disaient avoir parlé à une personne qu’ils connaissaient peu. Onze élèves n’ont pas remarqué de différence et quatre ont dit avoir préféré leur pause habituelle. Ces chiffres décrivent les élèves volontaires, pas l’ensemble du lycée.",
        "Le conseil propose de continuer l’expérience deux midis par semaine et d’ajouter une table plus calme. Selon ses membres, le projet doit donner un choix aux élèves. Il ne s’agit pas d’interdire les téléphones dans toute la cantine."
      ],
      evidence: "Justifiez avec une information du texte pourquoi le sondage ne permet pas de conclure que tous les élèves du lycée veulent une pause sans écran.",
      modelEvidence: "Le sondage ne porte que sur 40 participants volontaires. Les autres élèves n’ont pas été interrogés et, même parmi les volontaires, les avis diffèrent.",
      questions: [
        ["Comment les élèves participaient-ils ?", ["Sur décision du professeur.", "Obligatoirement pendant deux semaines.", "En choisissant eux-mêmes de s’asseoir à cette table."], 2, "Le premier paragraphe précise « les élèves qui le voulaient »."],
        ["Combien d’élèves disent avoir parlé à une personne peu connue ?", ["25", "11", "4"], 0, "Le sondage indique 25 sur 40."],
        ["À qui s’appliquent ces résultats ?", ["À tous les élèves de Bruxelles.", "Aux 40 élèves interrogés.", "À tous les élèves du lycée."], 1, "Le texte limite explicitement les conclusions aux volontaires interrogés."],
        ["Quel est le prochain objectif du conseil ?", ["Interdire les téléphones.", "Supprimer l’initiative.", "Continuer avec des options pour différents élèves."], 2, "Le projet propose deux midis par semaine et une table plus calme, en laissant le choix."]
      ]
    },
    listening: {
      title: "Le conseil des élèves dresse le bilan",
      audio: "assets/bilan.mp3",
      transcript: "Bonjour, ici Samira, du conseil des élèves. Nous avons demandé aux participants ce qu’ils pensaient de la table sans téléphone. Plusieurs ont aimé les cartes de conversation, mais d’autres ont trouvé la table trop bruyante. À partir de lundi, une deuxième table sera disponible dans la cour. S’il pleut, elle sera dans la salle près de la cantine. Nous garderons les cartes pour que chacun puisse entrer dans la conversation plus facilement. Il faudra encore observer si cette nouvelle organisation convient aux élèves qui recherchent une pause calme. Nous ferons le point dans trois semaines.",
      questions: [
        ["Quelle difficulté certains élèves ont-ils signalée ?", ["Il y avait trop de bruit.", "Il n’y avait pas de cartes.", "La cantine fermait trop tôt."], 0, "Certains élèves ont trouvé la table trop bruyante."],
        ["Où se trouvera la nouvelle table en cas de pluie ?", ["Dans la cour.", "Dans une salle près de la cantine.", "À la bibliothèque."], 1, "La salle près de la cantine est le lieu prévu en cas de pluie."],
        ["Pourquoi gardent-ils les cartes ?", ["Pour vérifier les présences.", "Pour écrire les résultats.", "Pour aider chacun à participer à la conversation."], 2, "Samira explique l’objectif avec « pour que chacun puisse… »."],
        ["Qu’est-ce qui reste à vérifier ?", ["Si les cartes sont assez grandes.", "Si l’organisation convient aux élèves qui veulent du calme.", "Si les téléphones fonctionnent dans la cour."], 1, "Le groupe vérifiera si une pause plus calme fonctionne pour les élèves concernés."]
      ]
    },
    writing: {
      title: "Présenter le bilan d’une initiative",
      format: "Compte rendu",
      alternatives: ["Message sur un forum", "Courriel personnel"],
      prompt: "La direction du lycée souhaite savoir si la pause sans écran mérite d’être reconduite. Rédigez un compte rendu à partir de la lecture. Décrivez l’initiative, interprétez un chiffre avec prudence et recommandez une suite.",
      points: ["Identifiez le destinataire et l’objectif du document.", "Présentez deux faits et signalez la limite du sondage.", "Recommandez une mesure réaliste et justifiez-la avec un lien de cause, de but ou de condition."],
      structure: ["Titre et destinataire", "Contexte et méthode", "Résultats et limite", "Recommandation justifiée"],
      starter: "Titre : Bilan de [l’initiative]\nDestinataire : [Le public visé]\n\nContexte\n[Expliquez le projet.]\n\nRésultats\n[Présentez et nuancez les résultats.]\n\nRecommandation\n[Proposez une action et justifiez-la.]",
      model: "Bilan de la table sans téléphone\nÀ l’attention de la direction\n\nL’initiative a duré deux semaines et la participation était volontaire. Sur 40 participants, 25 disent avoir échangé avec une personne qu’ils connaissaient peu. Bien que ce résultat soit encourageant, il concerne seulement les élèves interrogés. Nous recommandons de poursuivre l’essai et de proposer un espace plus calme pour que les élèves puissent choisir le type de pause qui leur convient.",
      register: "Un ton neutre et précis. Séparez les résultats observés de votre recommandation.",
      notes: ["concession", "but", "condition"]
    },
    speaking: {
      title: "Une pause pour mieux se retrouver",
      prompts: ["Nommez des détails précis de l’image, puis interprétez l’ambiance.", "Reliez l’image au bien-être et expliquez un avantage et une limite des pauses sans écran.", "Comparez avec une initiative scolaire dans un contexte francophone étudié ou avec une règle que vous connaissez."],
      follow: ["Tout le monde apprécie-t-il le même genre de pause ? Pourquoi ?", "Dans quelles conditions conseilleriez-vous ce projet à un autre lycée ?"],
      extra: ["Organisation sociale · Qui devrait décider des règles au lycée ?", "Ingéniosité humaine · Dans quelles situations le téléphone améliore-t-il les échanges ?"]
    }
  }
];

const GRAMMAR = [
  {id:"modes", title:"Indicatif et subjonctif", intent:"Distinguer les faits, les souhaits et les doutes.", forms:["je constate que + indicatif","je souhaite que + subjonctif","je doute que + subjonctif"], patterns:["Je constate que…","Je souhaite que…","Je doute que…"], line:"Les élèves veulent que chacun puisse choisir ce qu’il partage.", rule:"Présentez un fait à l’indicatif. Exprimez le souhait ou le doute avec le subjonctif après les tournures proposées.", task:"Écrivez deux phrases pour le forum. Expliquez d’abord ce que vous constatez, puis formulez un souhait pour votre classe.", model:"Je constate que beaucoup d’élèves partagent des photos de groupe. Je souhaite que chacun puisse choisir si son image est publiée.", check:"Ai-je réservé le subjonctif au souhait ou au doute dans les tournures proposées ?"},
  {id:"temps", title:"Temps et subjonctif", intent:"Organiser les étapes d’une action.", forms:["avant que + subjonctif","en attendant que + subjonctif","jusqu’à ce que + subjonctif"], patterns:["Avant que…","Jusqu’à ce que…"], line:"Relisons les légendes avant que la classe publie les photos.", rule:"Les trois locutions des notes appellent le subjonctif. Si le sujet reste le même avec « avant de », l’infinitif convient.", task:"Dans le message de votre équipe, indiquez ce qu’il faut faire avant que le lycée publie les images.", model:"Demandons l’accord de chaque élève avant que le lycée mette les photos en ligne.", check:"Le verbe après « avant que » est-il au subjonctif ?"},
  {id:"condition", title:"Condition et exception", intent:"Préciser quand une proposition est possible.", forms:["si + indicatif","à condition que + subjonctif","sauf si + indicatif"], patterns:["Si…","À condition que…","Sauf si…"], line:"Nous pouvons organiser une autre pause à condition que la salle soit libre.", rule:"Après « si » et « sauf si », utilisez l’indicatif. Après « à condition que », utilisez le subjonctif.", task:"Donnez une condition pour poursuivre le projet de pause. Réécrivez-la une seconde fois en changeant de construction.", model:"Si la salle est libre, nous pouvons proposer deux tables. Nous pouvons proposer deux tables à condition que la salle soit libre.", check:"Ai-je changé le mode du verbe lorsque j’ai changé de construction ?"},
  {id:"concession", title:"Concession et opposition", intent:"Nuancer un avis et comparer deux situations.", forms:["bien que + subjonctif","même si + indicatif","tandis que + indicatif","avoir beau + infinitif"], patterns:["Bien que…","Même si…","Tandis que…"], line:"Bien que le projet soit apprécié, certains élèves préfèrent déjeuner au calme.", rule:"« Bien que » admet un fait avant d’introduire une objection. « Tandis que » permet de comparer. « Avoir beau » souligne un effort qui ne produit pas le résultat attendu.", task:"Nuancez un bilan positif en reconnaissant un besoin différent chez certains élèves.", model:"Bien que les cartes facilitent les échanges, certains élèves préfèrent une pause silencieuse. Il faudrait donc proposer deux espaces.", check:"La concession apporte-t-elle une vraie nuance à mon argument ?"},
  {id:"logique", title:"Cause, conséquence et impact", intent:"Justifier une idée et distinguer cause et résultat.", forms:["parce que + indicatif","en raison de + nom","c’est pourquoi + proposition","entraîner / favoriser + nom"], patterns:["Parce que…","C’est pourquoi…","Par conséquent…"], line:"Les élèves manquaient de sujets de conversation. C’est pourquoi le conseil a préparé des cartes.", rule:"La cause explique la décision. La conséquence indique ce qui arrive ensuite. Pour qualifier un effet, choisissez un verbe précis comme « favoriser », « réduire » ou « entraîner ».", task:"Réécrivez la même idée deux fois, en mettant d’abord l’accent sur la cause puis sur la conséquence.", model:"Le conseil a proposé des cartes parce que les élèves hésitaient à engager la conversation. Les élèves hésitaient à engager la conversation. C’est pourquoi le conseil a proposé des cartes.", check:"Le connecteur indique-t-il clairement quel fait explique l’autre ?"},
  {id:"but", title:"But et intention", intent:"Expliquer l’objectif d’une proposition.", forms:["pour + infinitif","afin de + infinitif","pour que + subjonctif"], patterns:["Afin de…","Pour que…"], line:"Nous proposons une autre table pour que les élèves puissent déjeuner au calme.", rule:"Utilisez « pour » ou « afin de » avec l’infinitif lorsque le sujet implicite est le même. Si le sujet change, « pour que » introduit le subjonctif.", task:"Rédigez une recommandation destinée à la direction et expliquez à qui elle profite.", model:"Nous proposons une table dans la cour pour que les élèves qui cherchent du calme puissent choisir leur place.", check:"Ai-je distingué l’action proposée de son objectif ?"}
];

const MOCK = {
  reading: {
    title:"Le portrait sonore",
    text:["Pour la semaine des langues, le lycée a invité les élèves à créer un portrait sonore. Chacun devait choisir un bruit qui évoque sa vie quotidienne. Noura a enregistré le bruit du tram qu’elle prend avec sa mère chaque matin. Elle aurait pu choisir la musique qu’elle écoute seule, mais elle voulait faire entendre une petite habitude familiale.","Le projet a été présenté à la médiathèque du quartier. Les visiteurs entendaient les sons au casque et pouvaient lire une courte légende. Les élèves qui ne voulaient pas donner leur nom pouvaient participer sous un prénom inventé."],
    questions:[["Pourquoi Noura a-t-elle choisi le tram ?",["Pour montrer une habitude familiale.","Pour annoncer un voyage.","Pour faire découvrir sa musique préférée."],0,"Elle prend le tram avec sa mère et veut partager cette habitude."],["Qu’est-ce que les visiteurs pouvaient lire ?",["Le règlement de la médiathèque.","Une courte légende.","Un horaire du tram."],1,"Une courte légende accompagnait chaque son."],["Quel choix protégeait la vie privée ?",["Écouter sans casque.","Supprimer les légendes.","Utiliser un prénom inventé."],2,"Un prénom inventé permettait de participer sans donner son vrai nom."]]
  },
  listening: {
    title:"Un changement pour la semaine des langues", audio:"assets/simulation.mp3",
    transcript:"Bonjour à toutes et à tous. Petit changement pour la semaine des langues : la présentation aura lieu jeudi à seize heures, et non vendredi. Si vous participez, envoyez votre enregistrement mercredi avant midi. La médiathèque a déjà des casques, donc vous n’avez pas besoin d’en apporter. En revanche, pensez à écrire deux phrases pour expliquer votre choix. Ces phrases aideront les visiteurs à comprendre les sons.",
    questions:[["Quand aura lieu la présentation ?",["Vendredi.","Jeudi à seize heures.","Mercredi matin."],1,"L’annonce avance la présentation à jeudi."],["Quand faut-il envoyer l’enregistrement ?",["Mercredi avant midi.","Jeudi après la présentation.","Vendredi à seize heures."],0,"Le délai annoncé est mercredi avant midi."],["Que faut-il préparer pour les visiteurs ?",["Des casques.","Un nouvel horaire.","Deux phrases qui expliquent le choix du son."],2,"Les deux phrases aident les visiteurs à comprendre les sons."]]
  }
};
