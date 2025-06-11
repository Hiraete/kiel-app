const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testAPIs() {
  console.log('🔍 Backend API Test Başlıyor...\n');

  // 1. Health Check
  try {
    const response = await axios.get('http://localhost:3000');
    console.log('✅ Health Check:', response.data);
  } catch (error) {
    console.log('❌ Health Check:', error.message);
  }

  // 2. Register Test
  try {
    const registerData = {
      name: 'Test User',
      email: 'test' + Date.now() + '@test.com',
      password: '123456',
      role: 'danisan'
    };
    
    console.log('\n📝 Register Test...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('✅ Register başarılı:', registerResponse.data);
    
    const token = registerResponse.data.token;
    
    // 3. Login Test
    console.log('\n🔐 Login Test...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: registerData.email,
      password: registerData.password
    });
    console.log('✅ Login başarılı:', loginResponse.data);

  } catch (error) {
    console.log('❌ Auth Test:', error.response?.data || error.message);
  }

  // 4. Users API Test
  try {
    console.log('\n👥 Users API Test...');
    const usersResponse = await axios.get(`${BASE_URL}/users`);
    console.log('✅ Users API çalışıyor');
  } catch (error) {
    console.log('❌ Users API:', error.response?.data || error.message);
  }

  // 5. Appointments API Test
  try {
    console.log('\n📅 Appointments API Test...');
    const appointmentsResponse = await axios.get(`${BASE_URL}/appointments`);
    console.log('✅ Appointments API çalışıyor');
  } catch (error) {
    console.log('❌ Appointments API:', error.response?.data || error.message);
  }

  console.log('\n🏁 Test tamamlandı!');
}

testAPIs(); 