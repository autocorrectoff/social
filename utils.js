function parseCodeFromResponse() {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  return params.code;
}

function toQueryString(obj) {
  var parts = [];
  for (var property in obj) {
    var value = obj[property];
    if (value != null && value != undefined)
      parts.push(
        encodeURIComponent(property) + "=" + encodeURIComponent(value)
      );
  }
  return "?" + parts.join("&");
}
