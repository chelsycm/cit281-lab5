const students = [
    {
      id: 1,
      last: "Last1",
      first: "First1",
    },
    {
      id: 2,
      last: "Last2",
      first: "First2",
    },
    {
      id: 3,
      last: "Last3",
      first: "First3",
    }
  ];

// Require the Fastify framework and instantiate it
const fastify = require("fastify")();
// Student Route
fastify.get("/cit/student", (request, reply) => {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send(students);
});
// Student ID Route 
fastify.get("/cit/student/:id", (request, reply) => {
    // 1) Client makes a request to server 
    // Get the Id 
    console.log(request);
    let studentIDFromClient = request.params.id;
    
	//  2) The server (Us) does something with the request 
    // Get the student associated with the id given from 
    let studentRequestFromClientID = null;

    for (studentsInArray of students){
        if (studentsInArray.id == studentIDFromClient) {
            studentRequestFromClientID = studentsInArray;
            break;
        }
    }
    //  3) Give a response
    // Send the student data found in (2) to the client 
    if (studentRequestFromClientID != null) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(studentRequestFromClientID);
    }
    else {
        reply 
        .code(404)
        .header("Content-Type", "text/html; charset-utf-8")
        .send("<h1>No student with the given ID was found");
    }
  });

// Unmatched/ Wildcard route 
fastify.get("*", (request, reply) => {
    reply
      .code(200)
      .header("Content-Type", "text/html; charset=utf-8")
      .send("<h1>At Unmatched Route</h1>");
  });

  // Add a student
fastify.post("/cit/students/add", (request, reply) => {
    // 1) Get request from client 
    let objectFromClient = JSON.parse(request.body);
    console.log(objectFromClient);
    // 2) Do something with the request 
    // (a) Get the max id from the current array 
    // (b) Create a  new student object, compsed of userData and max id +
    let maxID = 0
    for (individualStudent of students) {
      if (maxID < individualStudent.id) {
        maxID = individualStudent.id;
      }
    }
    
    let generatedStudent = {
      id: maxID + 1,
      last: objectFromClient.lname,
      first: objectFromClient.fname,
    };

    students.push(generatedStudent);

    // 3) Reply to client
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(generatedStudent);
  });
  
  // Start server and listen to requests using Fastify
const listenIP = "localhost";
const listenPort = 8080;
fastify.listen(listenPort, listenIP, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});