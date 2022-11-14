// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:1234';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data', { data });
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function postUserFragments(user, document) {
    //Check the content type here
    console.log(document.querySelector('#content').value);
  if (!document.querySelector('#fragment').value.length) {
    document = JSON.stringify(document); //converts value to a JSON string
    console.log(document);
  }
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // https://developer.mozilla.org/ja/docs/Web/API/Fetch_API/Using_Fetch
      // Generate headers with the proper Authorization bearer token to pass
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.idToken}`,

        // Get the value from content type drop down, and send it to the backend
        'Content-Type': document.querySelector('#content').value,
        
      },
      body: document.querySelector('#fragment').value,
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const jsonData = await res.json();
    console.log('Post user fragments data',  jsonData );
  } catch (err) {
    console.error('Unable to call POST /v1/fragment', { err });
  }
  console.log('Entered Fragment: ' + document.querySelector('#fragment').value);
  document.querySelector('#fragment').value = '';
}

export async function displayUserFragment(user, document) {

/*

`${apiUrl}/v1/fragments/${document.querySelector('#fragmentId').value}${document.querySelector('#convert').value ? '.'+document.querySelector('#convert').value : ""}`

`${apiUrl}/v1/fragments/
${document.querySelector('#fragmentId').value}  ID

Do I have extension? extension : ""
${document.querySelector('#convert').value ? '.'+document.querySelector('#convert').value : ""}`

*/

console.log( `${apiUrl}/v1/fragments/${document.querySelector('#fragmentId').value}${document.querySelector('#convert').value ? '.'+document.querySelector('#convert').value : ""}`)
  try {
    const res = await fetch(
      `${apiUrl}/v1/fragments/${document.querySelector('#fragmentId').value}${document.querySelector('#convert').value ? '.'+document.querySelector('#convert').value : ""}`,
      {
        headers: {
          Authorization: `Bearer ${user.idToken}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    let text = await res.text();
   console.log(res.headers.get('content-type'));
    console.log('Fragment:', text);
  } catch (err) {
    console.error('Unable to get fragments by id', { err });
  }
}

export async function displayUserFragmentsExpand(user, document) {
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/?expand=1`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got all fragments data', { data });
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function displayUserFragmentMetaInfo(user, document) {
  try {
    const res = await fetch(
      //Send it to the backend
      `${apiUrl}/v1/fragments/${document.querySelector('#fragmentId').value}/info`,
      {
        headers: {
          Authorization: `Bearer ${user.idToken}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    // res gets the resonse from the server and then display 
    let text = await res.json();
   console.log(res.headers.get('content-type'));
    console.log('Fragment:', text);
  } catch (err) {
    console.error('Unable to get fragments by id', { err });
  }
}
