var a;

<login>
  
  <form onsubmit={ login }>
    <h2>Log In</h2>
    <div class="error" style="display:none"></div>
    <input type="text" id="username" placeholder="Username">
    <input type="password" id="password" placeholder="Password">
    <button>Log In</button>
  </form>
  
  <form onsubmit={ register }>
    <h2>Sign Up</h2>
    <div class="error" style="display:none"></div>
    <input type="text" id="username" placeholder="Username">
    <input type="password" id="password" placeholder="Create a Password">
    <button>Sign Up</button>
  </form>

  login() 
  {
    a = 123;
  }
  
  register()
  {
    a = 456;
  }
</login>
