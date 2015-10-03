horizon.realtime = {

  '/project/instances/': {

    "compute.instance.create.start": function(event) {
      console.log("Instance is being created", event);
      var $row = $('<tr class="status_unknown ajax-update" />');
      $row.attr('id', 'instances__row__' + event.instance_id);
      var base_update_url = '/project/instances/?action=row_update&table=instances&obj_id=';
      $row.attr('data-update-url', base_update_url + event.instance_id);

      $('#instances').prepend($row);
      $row.addClass('status_unknown');
      horizon.datatables.update();
    },

    "compute.instance.create.end": function(event) {
      console.log("Instance created", event);
      var $row = $('#instances tr#instances__row__' + event.instance_id);
      $row.addClass('status_unknown');
      horizon.datatables.update();
    },

    "compute.instance.suspend": function(event) {
      console.log("Instance suspended", event);
      var $row = $('#instances tr#instances__row__' + event.instance_id);
      $row.addClass('status_unknown');
      horizon.datatables.update();
    },

    "compute.instance.resume": function(event) {
      console.log("Instance resumed", event);
      var $row = $('#instances tr#instances__row__' + event.instance_id);
      $row.addClass('status_unknown');
      horizon.datatables.update();
    },

    "compute.instance.delete.start": function(event) {
      console.log("Instance is being deleted", event);
      var $row = $('#instances tr#instances__row__' + event.instance_id);
      $row.addClass('status_unknown');
      horizon.datatables.update();
    },

    "compute.instance.delete.end": function(event) {
      console.log("Instance deleted", event);
      var $row = $('#instances tr#instances__row__' + event.instance_id);
      $row.remove();
    }

  }

};

horizon.addInitFunction(function() {
  var namespace = window.location.pathname;
  var conn = ['//', window.location.host.split(':')[0], ':9000'].join('');
  var websocket = new WebSocket(conn)

  window.onbeforeunload = function() {
    if(horizon.realtime.socket) horizon.realtime.socket.close();
    horizon.realtime.socket = null;
  };

  websocket.onopen = function () {
    console.log('Connected to Zaqar through Websocket');
    horizon.realtime.websocket = websocket;
  };

  websocket.onclose = function () {
    console.log('Closed Zaqar connection', websocket);
    horizon.datatables.update();
    horizon.realtime.websocket = null;
  };

  websocket.onmessage = function(e) {
    var event_type = e.data.event_type;
    var handler = horizon.realtime[namespace][event_type];
    if(handler) handler(e.data.payload);
  };
});
