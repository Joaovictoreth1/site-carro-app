import { useState } from 'react'
import { compareFuel, fields, initialValues } from './fuel.js'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function App() {
  const [values, setValues] = useState(initialValues)
  const [submitted, setSubmitted] = useState(null)
  const { errors, result } = submitted ?? {}

  function calculate(event) {
    event.preventDefault()
    const next = compareFuel(values)
    setSubmitted(next)
    const firstError = Object.keys(next.errors)[0]
    if (firstError) event.currentTarget.elements.namedItem(firstError)?.focus()
  }

  return (
    <main className="workspace">
      <header>
        <p className="eyebrow">Custo por percurso</p>
        <h1>Compare gasolina e etanol</h1>
        <p>Use os preços locais e o consumo do seu carro para estimar o gasto com combustível.</p>
      </header>

      <div className="layout">
        <form className="panel" onSubmit={calculate} noValidate>
          <fieldset>
            <legend>Dados do percurso</legend>
            <p id="decimal-hint">Use vírgula ou ponto para os decimais, sem separador de milhar.</p>
            <div className="fields">
              {fields.map(field => (
                <div className={field.id === 'distance' ? 'wide' : undefined} key={field.id}>
                  <label htmlFor={field.id}>{field.label}</label>
                  <input id={field.id} name={field.id} inputMode="decimal" required maxLength={10}
                    value={values[field.id]} aria-invalid={Boolean(errors?.[field.id])}
                    aria-describedby={errors?.[field.id] ? `${field.id}-error` : 'decimal-hint'}
                    onChange={event => {
                      const value = event.currentTarget.value
                      setValues(previous => ({ ...previous, [field.id]: value }))
                      setSubmitted(null)
                    }} />
                  {errors?.[field.id] && <small id={`${field.id}-error`}>{errors[field.id]}</small>}
                </div>
              ))}
            </div>
          </fieldset>
          <div className="actions">
            <button type="submit">Comparar custos</button>
            <button type="reset" onClick={() => {
              setValues(initialValues)
              setSubmitted(null)
            }}>Restaurar exemplo</button>
          </div>
        </form>

        <section className="panel" aria-labelledby="results">
          <h2 id="results">Estimativa do percurso</h2>
          <div aria-live="polite" aria-atomic="true">
            {result ? (
              <>
                <p className="recommendation">{result.cheaper
                  ? `${result.cheaper} é estimado em ${brl.format(result.savings)} a menos.`
                  : 'Os dois combustíveis têm o mesmo custo estimado.'}</p>
                <table>
                  <thead><tr><th scope="col">Combustível</th><th scope="col">Por km</th><th scope="col">Total</th></tr></thead>
                  <tbody>{result.options.map(option => (
                    <tr key={option.name}><th scope="row">{option.name}</th>
                      <td>{brl.format(option.perKm)}</td><td>{brl.format(option.total)}</td></tr>
                  ))}</tbody>
                </table>
              </>
            ) : <p>{errors ? 'Revise os campos indicados para comparar.' : 'Preencha os dados e selecione Comparar custos.'}</p>}
          </div>
          <p className="note">A estimativa não inclui pedágios, manutenção ou variações de consumo no trajeto.</p>
        </section>
      </div>
    </main>
  )
}
