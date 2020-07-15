let button;
let responsediv;

function notFound() {
  const location = window.location.href;
  if (location.includes('?error=not-found')) {
    document.getElementById('main').innerHTML = `
    <div class="row" id="not-found">
    <div class="form url-form col-sm-12 text-center">
      <h1 class="logo">ERROR</h1>
      <hr>
      <br>
      <p class="error-message">Sorry! We weren't able to find this short-url. Please create a new one
        <a class="link" href="/" role="link" style="color: white;">here</a>.
      </p>
      <br>
      <img src="https://media.giphy.com/media/3o7aTskHEUdgCQAXde/giphy-downsized.gif" class="img-responsive"
        alt="Image">
    </div>
  </div>
    `;
  } else {
    document.getElementById('main').innerHTML = `
      <div class="row">
      <div class="url-form col-xs-12">
        <form>
          <h1 class="logo text-center">TRIMR</h1>
          <div class="form-group">
            <input id="url" type="text" class="form-control" placeholder="URL" required="required">
          </div>
          <div class="form-group">
            <input id="alias" type="text" class="form-control" placeholder="Alias (optional)">
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-danger btn-block" id="submit">Get Short URL
              ✨</button>
          </div>
          <hr>
          <div class="signature">
            <p class="sign-text">Made with ♥ by <strong><a href="http://trimr.cc/linkedin">Kartik</strong></p>
          </div>
        </form>
      </div>

    </div>`;
  }
  button = document.getElementById('submit');
  responsediv = document.getElementById('response');
  button.addEventListener(
    'click',
    () => {
      submit(event).then((data) => {
        let display = {
          template: '',
          data: '',
        };
        if (data.trimmedUrl) {
          // display trimmed url.
          display.data = data.trimmedUrl;
          display.template = `
          <div class="input-group mb-3">
          <input class="form-control" type="text" value="${display.data}" id="trimmedUrl" readonly>
              <div class="input-group-append">
                  <span class="btn btn-warning" onClick="copyUrl()" id="Copy">Copy!</span>
              </div>
          </div>`;
        } else if (data.error) {
          // display error.
          display.data = data.error;
          display.template = `
          <div class="alert alert-danger" role="alert">${display.data}</div>
          `;
        }
        responsediv.innerHTML = display.template;
      });
    },
    false
  );
}

window.onload = notFound;

function copyUrl() {
  let copyText = document.getElementById('trimmedUrl');
  copyText.select();
  // for mobile devices.
  copyText.setSelectionRange(0, 99999);
  //Copy the text inside the text field
  document.execCommand('copy');

  document.getElementById('Copy').innerHTML = 'Copied ✔';
  document.getElementById('Copy').className = 'btn btn-success';
}

async function submit(event) {
  event.preventDefault();

  let urlValue = document.getElementById('url').value;
  const aliasValue = document.getElementById('alias').value;

  if (urlValue) {
    if (!(urlValue.startsWith('https://') || urlValue.startsWith('http://'))) {
      urlValue = 'https://' + urlValue;
    }
  }

  var myHeaders = {
    'Content-Type': 'application/json',
  };

  var raw = JSON.stringify({
    alias: aliasValue,
    url: urlValue,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };

  try {
    const res = await fetch('/url', requestOptions);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
