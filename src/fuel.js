export const fields = [
  { id: 'distance', label: 'Distância (km)', max: 20000 },
  { id: 'gasPrice', label: 'Gasolina (R$/L)', max: 100 },
  { id: 'ethanolPrice', label: 'Etanol (R$/L)', max: 100 },
  { id: 'gasEfficiency', label: 'Consumo com gasolina (km/L)', max: 100 },
  { id: 'ethanolEfficiency', label: 'Consumo com etanol (km/L)', max: 100 },
]

export const initialValues = {
  distance: '150',
  gasPrice: '6,19',
  ethanolPrice: '4,29',
  gasEfficiency: '12',
  ethanolEfficiency: '8,8',
}

function readDecimal(raw, max) {
  const text = raw.trim()
  if (!/^\d+(?:[,.]\d{1,2})?$/.test(text)) return null
  const number = Number(text.replace(',', '.'))
  return number > 0 && number <= max ? number : null
}

export function compareFuel(input) {
  const errors = {}
  const data = {}

  for (const field of fields) {
    const value = readDecimal(input[field.id] ?? '', field.max)
    if (value === null) errors[field.id] = `Use um valor entre 0,01 e ${field.max}, com até duas casas decimais.`
    else data[field.id] = value
  }
  if (Object.keys(errors).length) return { errors, result: null }

  const roundCents = value => Math.round(value * 100)
  const options = [
    ['Gasolina', data.gasPrice / data.gasEfficiency],
    ['Etanol', data.ethanolPrice / data.ethanolEfficiency],
  ].map(([name, perKm]) => ({
    name,
    perKm,
    cents: roundCents(perKm * data.distance),
  }))
  const [gas, ethanol] = options
  const difference = gas.cents - ethanol.cents
  return {
    errors,
    result: {
      options: options.map(({ name, perKm, cents }) => ({ name, perKm, total: cents / 100 })),
      cheaper: difference === 0 ? null : difference > 0 ? ethanol.name : gas.name,
      savings: Math.abs(difference) / 100,
    },
  }
}
