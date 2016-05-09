// redis init  
// load db models
// check db schema
// load components (create global modules .. connection , driver , controller)
// check nodes (db models) against components configurations
// check server health (response time)
// load plugins
// state ready for recieving requests
// provide a unified interface to communicate with through different interfaces 

/**
 *** click on icon
 *** show splash screen
 *** after App Ready
 ***     Hide splash screen
 *** show loading page
 *** check connection
 ***     if not then display error message with reload button
 ***     if present then continue
 *** check first start up
 ***     if true then display config page
 ***          if close/exit then stop
 ***          if save then connect to server
 ***     if not then continue
 *** connect with the server
 ***     if failed display config page
 **     if success
 **          check Auth
 **              if false then show login page
 **              if true
 **                  get all points and rooms
 **                  parse all points and rooms then display them into sidebar and home page
 */
