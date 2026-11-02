import test from 'node:test'
import assert from 'node:assert/strict'
import { validateEmailSyntax, passwordValidationError, normalizeIndianPhone } from '../src/validation.js'

test('email syntax normalizes valid email and rejects malformed input', () => {
  assert.deepEqual(validateEmailSyntax('  Student@Gmail.com '), {
    valid: true, normalized: 'student@gmail.com', domain: 'gmail.com',
  })
  assert.equal(validateEmailSyntax('not-an-email').valid, false)
  assert.equal(validateEmailSyntax('x@localhost').valid, false)
})

test('password requires length, upper/lowercase, digit and special character', () => {
  assert.equal(passwordValidationError('GoodPass9!'), null)
  assert.match(passwordValidationError('short'), /8 characters/)
  assert.match(passwordValidationError('goodpass9!'), /uppercase/)
  assert.match(passwordValidationError('GOODPASS9!'), /lowercase/)
  assert.match(passwordValidationError('GoodPass!!'), /number/)
  assert.match(passwordValidationError('GoodPass99'), /special character/)
})

test('Indian phone validation normalizes common formats and rejects invalid numbers', () => {
  assert.deepEqual(normalizeIndianPhone('+91 98765 43210'), { valid: true, phone: '+919876543210' })
  assert.deepEqual(normalizeIndianPhone('09876543210'), { valid: true, phone: '+919876543210' })
  assert.deepEqual(normalizeIndianPhone('9876543210'), { valid: true, phone: '+919876543210' })
  assert.equal(normalizeIndianPhone('12345').valid, false)
  assert.equal(normalizeIndianPhone('+1 202 555 0100').valid, false)
  assert.deepEqual(normalizeIndianPhone(''), { valid: true, phone: null })
})
