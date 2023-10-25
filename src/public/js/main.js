$(document).ready(function () {
  $('#tab-usuario').DataTable({
    columnDefs: [
      { width: "5%", targets: 0 },
      { width: "20%", targets: 1 },
      { width: "20%", targets: 2 },
      { width: "25%", targets: 3 },
      { width: "20%", targets: 4 },
      { width: "10%", targets: 5 },
      { width: "15%", targets: 6 },
      {
        targets: -2, // Última columna
        data: 'especial',
        render: function(data, type, row) {
          if (data === '1') {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },
      { width: "5%", targets: 6 },
    ],
    language: {
      "lengthMenu": "Mostrar _MENU_ registros",
      "zeroRecords": "No se encontraron resultados",
      "info": "Registros del _START_ al _END_ de  _TOTAL_",
      "infoEmpty": "Encontrados 0 ",
      "infoFiltered": "(de _MAX_ registros)",
      "sSearch": "Buscar:",
      "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Sig",
        "sPrevious": "Ant"
      },
      "sProcessing": "Procesando...",
    },
    //para usar los botones   
    responsive: "true",
    dom: 'Bfrtilp',
    buttons: [
      {
        extend: 'excelHtml5',
        text: '<i class="fas fa-file-excel"></i> ',
        titleAttr: 'Exportar a Excel',
        className: 'btn btn-success'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="fas fa-file-pdf"></i> ',
        titleAttr: 'Exportar a PDF',
        className: 'btn btn-danger',
        title: 'Usuarios',
        exportOptions: {
          columns: [0, 1, 2, 3, 4]
        }
      },
      {
        extend: 'print',
        text: '<i class="fa fa-print"></i> ',
        titleAttr: 'Imprimir',
        className: 'btn btn-info',
        title: 'Usuarios',
        exportOptions: {
          columns: [0, 1, 2, 3, 4]
        }
      },
    ]
  });
});


$(document).ready(function () {
  $('#table-puestos').DataTable({
    language: {
      "lengthMenu": "Mostrar _MENU_ registros",
      "zeroRecords": "No se encontraron resultados",
      "info": "Registros del _START_ al _END_ de  _TOTAL_",
      "infoEmpty": "Encontrados 0 ",
      "infoFiltered": "(de _MAX_ registros)",
      "sSearch": "Buscar:",
      "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Sig",
        "sPrevious": "Ant"
      },
      "sProcessing": "Procesando...",
    },
    //para usar los botones   
    responsive: "true",
    dom: 'Bfrtilp',
    buttons: [
      {
        extend: 'excelHtml5',
        text: '<i class="fas fa-file-excel"></i> ',
        titleAttr: 'Exportar a Excel',
        className: 'btn btn-success'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="fas fa-file-pdf"></i> ',
        titleAttr: 'Exportar a PDF',
        className: 'btn btn-danger',
        title: 'Puestos de Votación',
        exportOptions: {
          columns: [0, 1, 2, 3, 4]
        }
      },
      {
        extend: 'print',
        text: '<i class="fa fa-print"></i> ',
        titleAttr: 'Imprimir',
        className: 'btn btn-info',
        title: 'Puestos de Votación',
        exportOptions: {
          columns: [0, 1, 2, 3, 4]
        }
      },
    ]
  });
});


$(document).ready(function () {
  $('#tab-consulta').DataTable({
    columnDefs: [
      {
        targets: -6, // Última columna
        data: 'recuento',
        render: function(data, type, row) {
          if (data === '1') {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },
      {
        targets: -5, // Última columna
        data: 'reclama',
        render: function(data, type, row) {
          if (data === '1') {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },
      {
        targets: -4, // Última columna
        data: 'foto',
        render: function(data, type, row) {
          if (data === '1') {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },
      {
        targets: -3, // Última columna
        data: 'foto2',
        render: function(data, type, row) {
          if (data === '1') {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },
      {
        targets: -2, // Última columna
        data: 'foto3',
        render: function(data, type, row) {
          if (data === '1') {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },
      {
        targets: -1, // Última columna
        data: 'fotrec',
        render: function(data, type, row) {
          if (data === '1') {
            return '<input type="checkbox" disabled checked>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },
      {
        targets: 8, // darle color a la columna especifica (el índice se cuenta desde 0)
        className: 'highlight', // Clase CSS para resaltar la columna
      },
      { width: "5%", targets: 6 },
    ],
    searching: false,
    lengthChange: false,
    language: {
      "lengthMenu": "Mostrar _MENU_ registros",
      "zeroRecords": "No se encontraron resultados",
      "info": "Registros del _START_ al _END_ de  _TOTAL_",
      "infoEmpty": "Encontrados 0 ",
      "infoFiltered": "(de _MAX_ registros)",
      "sSearch": "Buscar:",
      "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Sig",
        "sPrevious": "Ant"
      },
      "sProcessing": "Procesando...",
    },
    //para usar los botones   
    responsive: "true",
    ordering: false,
  });
});

$(document).ready(function () {
  var municipio = $('.municipio').text();

  $('#tab-municipal').DataTable({
    createdRow: function(row, data, dataIndex) {
      if (data[8] == 'NO') {
        $(row).addClass('red');
        $('td', row).css('color', 'red');
        $('td', row).css('background-color', 'white');
      }
    },
    language: {
      "lengthMenu": "Mostrar _MENU_ registros",
      "zeroRecords": "No se encontraron resultados",
      "info": "Registros del _START_ al _END_ de  _TOTAL_",
      "infoEmpty": "Encontrados 0 ",
      "infoFiltered": "(de _MAX_ registros)",
      "sSearch": "Buscar:",
      "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Sig",
        "sPrevious": "Ant"
      },
      "sProcessing": "Procesando...",
    },
    //para usar los botones   
    responsive: "true",
    ordering: false,
    lengthChange: false,
    dom: 'Bfrtilp',
    buttons: [
      {
        extend: 'excelHtml5',
        text: '<i class="fas fa-file-excel"></i> ',
        titleAttr: 'Exportar a Excel',
        className: 'btn btn-success'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="fas fa-file-pdf"></i> ',
        titleAttr: 'Exportar a PDF',
        className: 'btn btn-danger',
        title: 'Resultados ' + municipio,
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6]
        }
      },
      {
        extend: 'print',
        text: '<i class="fa fa-print"></i> ',
        titleAttr: 'Imprimir',
        className: 'btn btn-info',
        title: 'Resultados ' + municipio,
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6]
        }
      },
    ]
  });
});

$(document).ready(function () {
  var municipio = $('.municipio').text();

  $('#tab-departamental').DataTable({
    createdRow: function(row, data, dataIndex) {
      if (data[8] == 'NO') {
        $(row).addClass('red');
        $('td', row).css('color', 'red');
        $('td', row).css('background-color', 'white');
      }
    },
    language: {
      "lengthMenu": "Mostrar _MENU_ registros",
      "zeroRecords": "No se encontraron resultados",
      "info": "Registros del _START_ al _END_ de  _TOTAL_",
      "infoEmpty": "Encontrados 0 ",
      "infoFiltered": "(de _MAX_ registros)",
      "sSearch": "Buscar:",
      "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Sig",
        "sPrevious": "Ant"
      },
      "sProcessing": "Procesando...",
    },
    //para usar los botones   
    responsive: "true",
    ordering: false,
    lengthChange: false,
    dom: 'Bfrtilp',
    buttons: [
      {
        extend: 'excelHtml5',
        text: '<i class="fas fa-file-excel"></i> ',
        titleAttr: 'Exportar a Excel',
        className: 'btn btn-success'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="fas fa-file-pdf"></i> ',
        titleAttr: 'Exportar a PDF',
        className: 'btn btn-danger',
        title: 'Resultados ' + municipio,
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6]
        }
      },
      {
        extend: 'print',
        text: '<i class="fa fa-print"></i> ',
        titleAttr: 'Imprimir',
        className: 'btn btn-info',
        title: 'Resultados ' + municipio,
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6]
        }
      },
    ]
  });
});
