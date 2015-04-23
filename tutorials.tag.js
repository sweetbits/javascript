<tutorials>
  <h1>{ opts.title }</h1>

  <div if={ Parse.User.current() }>ANONYM</div>
  <div hide={ Parse.User.current() }>LOGGED-IN</div>

  <ul>
    <li each={ tutorials }>
      <h2>{ title }</h2>
      <p>{ description }</p>
    </li>
  </ul>

  this.tutorials = opts.tutorials;

</tutorials>
