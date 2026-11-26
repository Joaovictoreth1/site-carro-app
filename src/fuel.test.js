import assert from 'node:assert/strict'
import { test } from 'node:test'
import { compareFuel, initialValues } from './fuel.js'

test('compares the full trip using separate fuel efficiencies', () => {
  const { errors, result } = compareFuel(initialValues)
  assert.deepEqual(errors, {})
  assert.deepEqual(result.options.map(option => option.total), [77.38, 73.13])
  assert.equal(result.cheaper, 'Etanol')
  assert.equal(result.savings, 4.25)
})

test('reports a tie when rounded trip costs match', () => {
  const { result } = compareFuel({
    distance: '0.01', gasPrice: '6', gasEfficiency: '12', ethanolPrice: '4,20', ethanolEfficiency: '8',
  })
  assert.equal(result.cheaper, null)
  assert.equal(result.savings, 0)
})

test('rejects missing, negative, grouped, excessive and zero inputs by field', () => {
  const { errors, result } = compareFuel({
    distance: '20.000', gasPrice: '', ethanolPrice: '-2', gasEfficiency: '101', ethanolEfficiency: '0',
  })
  assert.equal(result, null)
  assert.deepEqual(Object.keys(errors), Object.keys(initialValues))
})
