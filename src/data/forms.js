const FORM_KEY = 'zura-spa-forms'

export function saveForm(id, values) {
  const all = readForms()
  all[id] = {
    ...values,
    submittedAt: new Date().toISOString(),
  }
  localStorage.setItem(FORM_KEY, JSON.stringify(all))
  return all[id]
}

export function readForm(id) {
  return readForms()[id] || null
}

function readForms() {
  try {
    return JSON.parse(localStorage.getItem(FORM_KEY) || '{}')
  } catch {
    return {}
  }
}
