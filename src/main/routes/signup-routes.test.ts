import request from 'supertest';
import app from '../config/app';

describe("SignUp Routes", () => {
  it("Should return an account on success", async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: "Douglas",
        email: "daguiaralcanatara@gmail.com",
        password: "timao",
        passwordConfirmation: "timao"
      })
      .expect(200)
  })
})