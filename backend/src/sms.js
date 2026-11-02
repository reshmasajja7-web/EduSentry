// ============================================================
// EduSentry Multi-Provider SMS Gateway Service
// Supports:
// 1. Fast2SMS (India Quick SMS / OTP)
// 2. 2Factor.in (India SMS / OTP)
// 3. Twilio (Global SMS Carrier Network)
// 4. Fallback Local Console Logger
// ============================================================

export async function sendSmsOtp({ phone, otp }) {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
  const message = `Your EduSentry verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`

  console.log(`\n============================================================`)
  console.log(`📱 [SMS GATEWAY DISPATCH]`)
  console.log(`   Target Phone: ${cleanPhone}`)
  console.log(`   Security OTP: ${otp}`)
  console.log(`   Timestamp:    ${new Date().toISOString()}`)
  console.log(`============================================================`)

  let delivered = false
  let provider = 'Console/Local'

  // Extract pure 10-digit national number for Indian Gateways (Fast2SMS, 2Factor)
  let digitsOnly = cleanPhone.replace(/\D/g, '')
  let nationalNumber = digitsOnly
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    nationalNumber = digitsOnly.slice(2)
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    nationalNumber = digitsOnly.slice(1)
  }

  // ------------------------------------------------------------
  // 1. Fast2SMS Gateway (India - https://www.fast2sms.com)
  // ------------------------------------------------------------
  if (process.env.FAST2SMS_API_KEY) {
    try {
      console.log(`[Fast2SMS] Attempting dispatch to ${nationalNumber}...`)
      // Try Route 1: 'otp'
      let response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': process.env.FAST2SMS_API_KEY.trim(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: nationalNumber,
        }),
      })

      let data = await response.json()
      if (data.return) {
        console.log(`✓ [Fast2SMS] Successfully delivered OTP SMS to ${nationalNumber}`)
        delivered = true
        provider = 'Fast2SMS (OTP Route)'
      } else {
        console.warn(`[Fast2SMS OTP Route] Notice:`, data.message || data)
        // Try Route 2 fallback: 'q' (Quick SMS without DLT requirement)
        console.log(`[Fast2SMS] Falling back to Quick SMS route (q)...`)
        const qResponse = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': process.env.FAST2SMS_API_KEY.trim(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'q',
            message: `Your EduSentry verification code is ${otp}. Valid for 10 minutes.`,
            language: 'english',
            flash: 0,
            numbers: nationalNumber,
          }),
        })
        const qData = await qResponse.json()
        if (qData.return) {
          console.log(`✓ [Fast2SMS] Delivered via Quick SMS route to ${nationalNumber}`)
          delivered = true
          provider = 'Fast2SMS (Quick Route)'
        } else {
          console.warn(`[Fast2SMS Quick Route] Notice:`, qData.message || qData)
        }
      }
    } catch (err) {
      console.error(`✕ [Fast2SMS] Delivery exception:`, err.message)
    }
  }

  // ------------------------------------------------------------
  // 2. 2Factor.in Gateway (India - https://2factor.in)
  // ------------------------------------------------------------
  if (!delivered && process.env.TWOFACTOR_API_KEY) {
    try {
      console.log(`[2Factor] Attempting dispatch to ${nationalNumber}...`)
      const url = `https://2factor.in/API/V1/${encodeURIComponent(process.env.TWOFACTOR_API_KEY.trim())}/SMS/${encodeURIComponent(nationalNumber)}/${encodeURIComponent(otp)}/EduSentry`
      const response = await fetch(url, { method: 'GET' })
      const data = await response.json()
      if (data.Status === 'Success') {
        console.log(`✓ [2Factor] Successfully queued OTP SMS to ${nationalNumber}, Session: ${data.Details}`)
        delivered = true
        provider = '2Factor.in'
      } else {
        console.warn(`[2Factor] Response:`, data.Details || data)
      }
    } catch (err) {
      console.error(`✕ [2Factor] Delivery exception:`, err.message)
    }
  }

  // ------------------------------------------------------------
  // 3. Twilio Gateway (Global - https://www.twilio.com)
  // ------------------------------------------------------------
  if (
    !delivered &&
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_PHONE
  ) {
    try {
      console.log(`[Twilio] Attempting dispatch to ${cleanPhone}...`)
      const auth = Buffer.from(
        `${process.env.TWILIO_ACCOUNT_SID.trim()}:${process.env.TWILIO_AUTH_TOKEN.trim()}`
      ).toString('base64')

      const formattedTo = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`

      const params = new URLSearchParams()
      params.append('To', formattedTo)
      params.append('From', process.env.TWILIO_FROM_PHONE.trim())
      params.append('Body', message)

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID.trim()}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        }
      )

      const data = await response.json()
      if (data.sid) {
        console.log(`✓ [Twilio] Successfully queued SMS OTP to ${formattedTo}, SID: ${data.sid}`)
        delivered = true
        provider = 'Twilio'
      } else {
        console.warn(`[Twilio] Error:`, data.message || data)
      }
    } catch (err) {
      console.error(`✕ [Twilio] Delivery exception:`, err.message)
    }
  }

  // ------------------------------------------------------------
  // 4. Log Notice if no live provider is configured
  // ------------------------------------------------------------
  if (!delivered) {
    console.log(`⚠️  [NOTE] Real SMS was not dispatched via telecom carrier because no SMS Gateway key is set in backend/.env.`)
    console.log(`   To send SMS directly to ${cleanPhone}, set FAST2SMS_API_KEY, TWOFACTOR_API_KEY, or TWILIO_* in backend/.env.`)
    console.log(`   For immediate testing, enter code: ${otp}\n`)
  }

  return {
    delivered,
    provider,
    phone: cleanPhone,
  }
}
