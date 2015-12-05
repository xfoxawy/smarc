smarc.factory('Room', ['$resource', function($resource){
    // return $resource('', {
    //     id: '@id',
    //     page: '@page',
    //     pagination: '@pagination',
    // }, {
    //     update: { method: 'PUT' }
    // });
    return {
        rooms: [
            { name: "Room One" },
            { name: "Room Two" },
            { name: "Room Three" }
        ]
    }
}])
