import request from 'supertest'
import app from '../config/app'

describe('Content-Type Middleware', () => {
  app.use('/test_content_type', (req, res) => {
    res.send('')
  })

  app.use('/test_content_type_xml', (req, res) => {
    res.type('xml')
    res.send('')
  })

  test('Should return default content-type as json', async () => {
    await request(app)
      .get('/test_content_type')
      .expect('Content-Type', /json/)
  })

  test('Should return content-type as xml when forced', async () => {
    await request(app)
      .get('/test_content_type_xml')
      .expect('Content-Type', /xml/)
  })
})
