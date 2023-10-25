$(document).ready(function () {
  var municipio = $('.municipio').text();

  let codmpio, mpio, puestos, mesas, mesasreport, porc_report, totvot, totsuf, balance;
  var datoSet;
  var mCodigo;
  let table, tr, rowData;

  //Mostrar table
  let tablaDptal = $('#tab-dptal').DataTable({
    processing: true,
    ajax: {
      url: "/envios/tablampios",
      method: "GET",
      dataSrc: "",
    },
    rowId: "staffId",
    columns: [
      { data: "codmpio" },
      { data: "mpio" },
      { data: "puestos" },
      { data: "mesas" },
      { data: "mesasreport" },
      { data: "porc_report" },
      { data: "totvot" },
      { data: "totsuf" },
      { data: "balance" },
      {
        defaultContent: `<a href="#" class="btnBuscar text-primary" title="Mostrar"><i class="fas fa-search"></i></a>   
                         <a href="#" class="btnResult text-success" title="Resultados"><i class="fas fa-list-ol"></i></a>`,
      },
    ], 
    createdRow: function (row, data, dataIndex) {
      if (data.balance == 'NO') { // darle color de acuerdo a la condicion
        $(row).addClass('red');
        $('td', row).css('color', 'red');
        $('td', row).css('background-color', 'white');
      }
    },
    language: {
      lengthMenu: "Mostrar _MENU_ registros",
      zeroRecords: "No se encontraron resultados",
      info: "Registros del _START_ al _END_ de un total de  _TOTAL_",
      infoEmpty: "Encontrados 0 ",
      infoFiltered: "(de _MAX_ registros)",
      sSearch: "Buscar:",
      oPaginate: {
        sFirst: "Primero",
        sLast: "Último",
        sNext: "Sig",
        sPrevious: "Ant",
      },
      sProcessing: "Procesando...",
    },
    stateSave: true,
    //para usar los botones
    responsive: "true",
    order: [
      [0, "asc"],
    ],
    ordering: false,
    select: true,
    searching: true,
    lengthChange: false,
  });

  //Trae informacion mpio
  $(document).on("click", ".btnResult", function () {
    fila = $(this).closest("tr");
    mCodigo = fila.find("td:eq(0)").text();
    mMpio = fila.find("td:eq(1)").text();
    table = $('#tab-dptal').DataTable();
    tr = $(this).closest('tr');
    rowData = table.row(tr).data();

    limpiar();
    traeResult(mCodigo);
 
    $(".modal-header").css("background-color", "#7303c0");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Resultados de " + mMpio);
    $("#modalResult").modal("show");
  });


  //CANCELAR
  $(document).on("click", ".btnCancel", function () {
    $("#modalResult").modal("hide");
    limpiar();
  });

  $(document).on("click", ".btnBuscar", function () {
    fila = $(this).closest("tr");
    codigo = fila.find("td:eq(0)").text();
    mCodigo = codigo;

    // Redireccionar a la página con el valor de mCodigo en la URL
    window.location.href = "/envios/verifyMpal/" + mCodigo;
  });

});