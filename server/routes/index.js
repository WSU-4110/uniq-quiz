const express = require('express');
const {createClient} = require("@supabase/supabase-js");
const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

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
