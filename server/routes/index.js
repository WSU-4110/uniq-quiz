const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Express TEST TEST SIGNUP' });
})

router.post('/signup', async(req, res, next) => {
  const {email, password, displayName} = req.body;
  console.log(`Email: ${email}, Password: ${password}, displayName: ${displayName}`);
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        display_name: displayName,
      }
    }
  })
  res.json({data, error});
})

module.exports = router;

