function isEULocale() {
  const locale = browserLocale();
  let code = locale;

  if (locale.indexOf('-') >= 0) {
    code = locale.split('-')[1];
  }

  return !!countryCodes[code.toUpperCase()];
}

const countryCodes = {
  BE: 'Belgium',
  EL: 'Greece',
  LT: 'Lithuania',
  PT: 'Portugal',
  BG: 'Bulgaria',
  ES: 'Spain',
  LU: 'Luxembourg',
  RO: 'Romania',
  CZ: 'Czech Republic',
  FR: 'France',
  RE: 'Reunion',
  GP: 'Guadeloupe',
  MQ: 'Martinique',
  GF: 'French Guiana',
  YT: 'Mayotte',
  BL: 'Saint Barthelemy',
  MF: 'Saint Martin',
  PM: 'Saint Pierre and Miquelon',
  WF: 'Wallis and Futuna',
  PF: 'French Polynesia',
  NC: 'New Caledonia',
  HU: 'Hungary',
  SI: 'Slovenia',
  DK: 'Denmark',
  FO: 'Faroe Islands',
  GL: 'Greenland',
  HR: 'Croatia',
  MT: 'Malta',
  SK: 'Slovakia',
  DE: 'Germany',
  IT: 'Italy',
  NL: 'Netherlands',
  AW: 'Aruba',
  CW: 'Curacao',
  SX: 'Sint Maarten',
  FI: 'Finland',
  AX: 'Aland Islands',
  EE: 'Estonia',
  CY: 'Cyprus',
  AT: 'Austria',
  SE: 'Sweden',
  IE: 'Ireland',
  LV: 'Latvia',
  PL: 'Poland',
  UK: 'United Kingdom',
  GB: 'United Kingdom',
  AI: 'Anguilla',
  BM: 'Bermuda',
  IO: 'British Indian Ocean Territory',
  VG: 'British Virgin Islands',
  KY: 'Cayman Islands',
  FK: 'Falkland Islands',
  GI: 'Gibraltar',
  MS: 'Montserrat',
  PN: 'Pitcairn, Henderson, Ducie and Oeno Islands',
  SH: 'Saint Helena, Ascension and Tristan da Cunha',
  TC: 'Turks and Caicos Islands',
  GG: 'Guernsey',
  JE: 'Jersey',
  IM: 'Isle of Man',
};

function browserLocale() {
  if (window.navigator.languages && window.navigator.languages.length > 0) {
    return navigator.languages[0];
  }

  if (navigator.userLanguage) {
    return navigator.userLanguage;
  }

  return navigator.language;
}

const STRIPE_PUBLISHABLE_KEY = 'pk_live_pQpGXHnTYl2pZNEkhFEsoeVV';
const USER_CURRENCY = isEULocale() ? 'eur' : 'usd';
const taxRates = [];

const firebaseConfig = {
  apiKey: 'AIzaSyCpv2J6vYpNxce1pFvaupsbdg0ZaYdCMnc',
  authDomain: 'success-2020.firebaseapp.com',
  databaseURL: 'https://success-2020-default-rtdb.firebaseio.com',
  projectId: 'success-2020',
  storageBucket: 'success-2020.appspot.com',
  messagingSenderId: '505301001026',
  appId: '1:505301001026:web:e95596d564aa892ed8dedb',
  measurementId: 'G-S1C9G9XQ7X',
};

const FIREBASE_CLOUD_FUNCTIONS_LOCATION = 'us-central1';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

const firebaseUI = new firebaseui.auth.AuthUI(firebase.auth());
const firebaseUiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      return true;
    },
    uiShown: () => {
      document.querySelector('#loader').style.display = 'none';
    },
  },
  signInFlow: 'popup',
  signInSuccessUrl: window.location.href,
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  tosUrl: 'https://eveningkid.com/success/tos.html',
  privacyPolicyUrl: 'https://eveningkid.com/success/privacy.html',
};

firebase.auth().onAuthStateChanged((firebaseUser) => {
  if (firebaseUser) {
    document.querySelector('#loader').style.display = 'none';
    document.getElementById('signin-hint').style.display = 'none';
    document.querySelector('main').style.display = 'block';
    currentUser = firebaseUser.uid;
    startDataListeners();
  } else {
    document.querySelector('main').style.display = 'none';
    document.getElementById('signin-hint').style.display = 'block';
    firebaseUI.start('#firebaseui-auth-container', firebaseUiConfig);
  }
});

function createProductContainer(product) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('product');

  if (!product.last) {
    wrapper.classList.add('mr-4');
  }

  const container = document.createElement('div');
  container.classList.add('card');

  const header = document.createElement('header');
  header.classList.add('card-header');

  const headerText = document.createElement('p');
  headerText.classList.add('card-header-title');
  headerText.innerHTML = product.name;
  header.appendChild(headerText);

  if (product.choosen) {
    const choosenContainer = document.createElement('div');
    choosenContainer.classList.add('card-header-icon');

    const choosen = document.createElement('span');
    choosen.classList.add('tag');
    choosen.classList.add('is-rounded');
    choosen.innerHTML = 'Yours';
    choosenContainer.appendChild(choosen);

    header.appendChild(choosenContainer);
  }

  container.appendChild(header);

  const content = document.createElement('div');
  content.classList.add('card-content');

  const innerContent = document.createElement('div');
  innerContent.classList.add('content');

  if (product.description) {
    const description = document.createElement('p');
    description.innerHTML = product.description;
    innerContent.appendChild(description);
  }

  if (!product.choosen && product.price) {
    const prices = product.price.sort(function (a, b) {
      return b.save - a.save;
    });

    for (let i = 0; i < prices.length; i++) {
      const price = prices[i];

      const priceButton = document.createElement('button');
      priceButton.classList.add('button');
      priceButton.classList.add('is-fullwidth');
      priceButton.classList.add('is-small');
      priceButton.classList.add('mt-4');

      priceButton.addEventListener('click', subscribe.bind(this, price.id));

      priceButton.innerHTML =
        price.value +
        '/' +
        price.interval +
        (price.save ? ' (save ' + price.save + ' months)' : '');

      innerContent.appendChild(priceButton);
    }
  }

  content.appendChild(innerContent);
  container.appendChild(content);
  wrapper.appendChild(container);

  return wrapper;
}

function startDataListeners() {
  const products = document.querySelector('.products');

  db.collection('products')
    .where('active', '==', true)
    .get()
    .then(function (querySnapshot) {
      const basicProduct = {
        name: 'Basic',
        description: 'Keep your dailies on one device.',
        choosen: true,
      };

      products.appendChild(createProductContainer(basicProduct));

      const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: USER_CURRENCY,
      });

      querySnapshot.forEach(async function (doc) {
        const product = doc.data();
        product.last = true;
        product.price = [];

        const priceSnap = await doc.ref
          .collection('prices')
          .orderBy('unit_amount')
          .get();

        priceSnap.docs.forEach((doc) => {
          const price = doc.data();

          if (price.currency === USER_CURRENCY) {
            product.price.push({
              id: doc.id,
              interval: price.interval,
              value: currencyFormatter.format(
                (price.unit_amount / 100).toFixed(2)
              ),
              save: price.interval === 'year' ? 2 : 0,
            });
          }
        });

        products.appendChild(createProductContainer(product));
      });
    });

  db.collection('customers')
    .doc(currentUser)
    .collection('subscriptions')
    .where('status', 'in', ['trialing', 'active'])
    .onSnapshot(async (snapshot) => {
      if (snapshot.empty) {
        document.querySelector('#subscribe').style.display = 'block';
        return;
      }

      document.querySelector('#subscribe').style.display = 'none';
      document.querySelector('#my-subscription').style.display = 'block';

      const subscription = snapshot.docs[0].data();
      const priceData = (await subscription.price.get()).data();

      const subscriptionDetailsContainer = document.querySelector(
        '#my-subscription #subscription-details'
      );

      const subscriptionPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: priceData.currency,
      }).format((priceData.unit_amount / 100).toFixed(2));

      let subscriptionDetails =
        '<strong>You are paying ' +
        subscriptionPrice +
        ' per ' +
        priceData.interval +
        '.</strong> ';

      if (subscription.cancel_at_period_end) {
        subscriptionDetails +=
          'Your membership will end on ' +
          new Date(subscription.cancel_at.seconds * 1000).toLocaleDateString() +
          ' if not renewed.';
      } else {
        subscriptionDetails +=
          'Your membership will be renewed on ' +
          new Date(
            subscription.current_period_end.seconds * 1000
          ).toLocaleDateString() +
          '.';
      }

      subscriptionDetailsContainer.innerHTML = subscriptionDetails;
    });
}

document
  .getElementById('signout')
  .addEventListener('click', () => firebase.auth().signOut());

async function subscribe(priceId) {
  document.querySelectorAll('button').forEach((b) => (b.disabled = true));

  const docRef = await db
    .collection('customers')
    .doc(currentUser)
    .collection('checkout_sessions')
    .add({
      price: priceId,
      allow_promotion_codes: true,
      tax_rates: taxRates,
      success_url: window.location.href,
      cancel_url: window.location.href,
    });

  docRef.onSnapshot((snap) => {
    const { error, sessionId } = snap.data();
    if (error) {
      alert(`An error occured: ${error.message}`);
      document.querySelectorAll('button').forEach((b) => (b.disabled = false));
    }

    if (sessionId) {
      const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
      stripe.redirectToCheckout({ sessionId });
    }
  });
}

document
  .querySelector('#billing-portal-button')
  .addEventListener('click', async (event) => {
    document.querySelectorAll('button').forEach((b) => (b.disabled = true));

    const functionRef = firebase
      .app()
      .functions(FIREBASE_CLOUD_FUNCTIONS_LOCATION)
      .httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');

    const { data } = await functionRef({
      returnUrl: window.location.href,
    });

    window.location.assign(data.url);
  });
