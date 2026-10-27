// Saves a website form submission to PostgreSQL (POST /api/forms, served by the
// gloaro-forms service behind nginx). `fields` is { 'Label': value }; empty
// values are dropped server-side.
// Resolves to the saved reference (e.g. "GLO-20261012-7K3QX"), or null when it
// couldn't be saved. Never throws, so a failure can't break the calling form.
export async function submitForm(form, fields) {
  try {
    const response = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ form, fields, page: window.location.pathname }),
    })
    const result = await response.json().catch(() => ({}))
    return response.ok && result.ok === true ? result.reference : null
  } catch {
    return null
  }
}
