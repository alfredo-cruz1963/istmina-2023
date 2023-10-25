$(document).ready(function () {
  var municipio = $('.municipio').text();

  let dep, mun, zona, puesto, can, votos, sufragos, recuento, codigo;
  var datoSet;
  var mCodigo;
  let table, tr, rowData;

  //MOSTRAR
  let tablaEnvios = $("#tab-verificar").DataTable({
    processing: true,
    ajax: {
      url: "/envios/verificar/" + mCodPuesto,
      method: "GET",
      dataSrc: "",
    },
    rowId: "staffId",
    columns: [
      { data: "codigo" },
      { data: "mesa" },
      { data: "can1" },
      { data: "can2" },
      { data: "can3" },
      { data: "can4" },
      { data: "can5" },
      { data: "can6" },
      { data: "can7" },
      { data: "blancos" },
      { data: "nulos" },
      { data: "nomarcado" },
      { data: "sufragos" },
      { data: "recuento" },
      { data: "reclama" },
      { data: "foto" },
      { data: "foto2" },
      { data: "foto3" },
      { data: "fotrec" },
      {
        defaultContent: `<a href="#" class="btnEditar text-success" title="Verificar"><i class="fas fa-check"></i></a>
                         <a href="#" class="btnFotReclama text-primary" title="Foto Reclamación"><i class="fas fa-edit"></i></a>`,
      },
    ],
    createdRow: function (row, data, dataIndex) {
      const reclamaValue = data.reclama; // Obtenemos el valor de la columna 'reclama' para esta fila
      const reclamaFoto = data.fotrec; // Obtenemos el valor de la columna 'reclama' para esta fila
      const btnFotReclama = $(row).find('.btnFotReclama'); // Obtenemos el botón 'btnFotReclama' de la fila actual
  
      if (reclamaValue === '1' && reclamaFoto === '1') {
        // Si el valor de 'reclama' es igual a '1', mostramos el botón 'btnFotReclama'
        btnFotReclama.show();
      } else {
        // Si el valor de 'reclama' no es igual a '1', ocultamos el botón 'btnFotReclama'
        btnFotReclama.hide();
      }
  
      if (data.balance == 'NO') { // darle color de acuerdo a la condicion
        $(row).addClass('red');
        $('td', row).css('color', 'red');
        $('td', row).css('background-color', 'white');
      }
    },
    columnDefs: [
      {
        targets: -7, // penultima columna
        data: 'recuento',
        render: function (data, type, row) {
          if (data === '1') {
            return '<input type="checkbox" checked disabled>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },
      {
        targets: -6, // Última columna
        data: 'reclama',
        render: function (data, type, row) {
          if (data === '1') {
            return '<input type="checkbox" checked disabled>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },
      {
        targets: -5, // Última columna foto 1
        data: 'foto',
        render: function (data, type, row) {
          if (data === '1') {
            return `<input type="checkbox" class="chkFoto1" checked disabled>`;
          } else {
            return '<input type="checkbox" class="chkFoto1" disabled>';
          }
        }
      },
      {
        targets: -4, // Última columna foto 2
        data: 'foto2',
        render: function (data, type, row) {
          if (data === '1') {
            return `<input type="checkbox" class="chkFoto2" checked disabled>`;
          } else {
            return '<input type="checkbox" class="chkFoto2" disabled>';
          }
        }
      },
      {
        targets: -3, // Última columna foto 2
        data: 'foto3',
        render: function (data, type, row) {
          if (data === '1') {
            return `<input type="checkbox" class="chkFoto3" checked disabled>`;
          } else {
            return '<input type="checkbox" class="chkFoto3" disabled>';
          }
        }
      },
      {
        targets: -2, // Última columna foto 2
        data: 'fotrec',
        render: function (data, type, row) {
          if (data === '1') {
            return `<input type="checkbox" class="chkFoto4" checked disabled>`;
          } else {
            return '<input type="checkbox" class="chkFoto4" disabled>';
          }
        }
      },
      {
        targets: 8, // darle color a la columna especifica (el índice se cuenta desde 0)
        className: 'highlight', // Clase CSS para resaltar la columna
      },
    ],
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
    searching: false,
    lengthChange: false,
  });

  // Modal
  $(document).ready(function () {
    $("#modalEnvios").on('shown.bs.modal', function () {
      $("#sufraga").focus();

      const myImage1 = document.getElementById('imageE14-1');
      myImage1.src = '';
      const myImage2 = document.getElementById('imageE14-2');
      myImage2.src = '';
      const myImage3 = document.getElementById('imageE14-3');
      myImage2.src = '';

      traerE14(mCodigo);
      //traereclama(mCodigo);
    });
  });

  // Modal Reclama
  $(document).on("click", ".btnFotReclama", function () {
    fila = $(this).closest("tr");
    mCodigo = fila.find("td:eq(0)").text();
    mMesa = fila.find("td:eq(1)").text();
    table = $('#tab-control').DataTable();
    tr = $(this).closest('tr');
    rowData = table.row(tr).data();

    traereclama(mCodigo);
   
    $(".modal-header").css("background-color", "#7303c0");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Reclamación -- mesa: " + mMesa);
    $("#modalReclama").modal("show");
  });

  //CANCELAR
  $(document).on("click", ".btnCancel", function () {
    $("#modalEnvios").modal("hide");
    $("#modalReclama").modal("hide");
  });

  //EDITAR
  $("#tab-verificar tbody").on("click", "tr", function () {
    var id = tablaEnvios.row(this).index();
    datoSet = tablaEnvios.row(this).data();
  });

  $(document).on("click", ".btnEditar", function () {
    fila = $(this).closest("tr");
    $("#mesa").attr("readonly", true);
    codigo = fila.find("td:eq(0)").text();
    mCodigo = codigo;
    mesa = datoSet.mesa;
    sufragos = datoSet.sufragos;
    can1 = datoSet.can1;
    can2 = datoSet.can2;
    can3 = datoSet.can3;
    can4 = datoSet.can4;
    can5 = datoSet.can5;
    can6 = datoSet.can6;
    can7 = datoSet.can7;
    blancos = datoSet.blancos;
    nulos = datoSet.nulos;
    nomarcado = datoSet.nomarcado;
    recuento = datoSet.recuento;
    reclama = datoSet.reclama;

    $("#mesa").val(mesa);
    $("#sufraga").val(sufragos);
    $("#votos1").val(can1);
    $("#votos2").val(can2);
    $("#votos3").val(can3);
    $("#votos4").val(can4);
    $("#votos5").val(can5);
    $("#votos6").val(can6);
    $("#votos7").val(can7);
    $("#votos8").val(blancos);
    $("#votos9").val(nulos);
    $("#votos10").val(nomarcado);
    $('[type=checkbox][name="recuento"]:checked').attr("value");
    $('[type=checkbox][name="reclama"]:checked').attr("value");

    const checkbox = document.getElementById('recuento');
    const checkbox2 = document.getElementById('reclama');

    if (recuento === '1') {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }

    checkbox.addEventListener('change', function () {
      if (this.checked) {
        this.value = '1';
      } else {
        this.value = '0';
      }
    });

    if (reclama === '1') {
      checkbox2.checked = true;
    } else {
      checkbox2.checked = false;
    }

    checkbox2.addEventListener('change', function () {
      if (this.checked) {
        this.value = '1';
      } else {
        this.value = '0';
      }
    });

    $(".modal-header").css("background-color", "#7303c0");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Verificar Mesa -- " + mesa);
    $(".btnGrabar").text("Actualizar");
    $("#mesa").focus();
    $("#modalEnvios").modal("show");
  });

  //submit para CREAR y EDITAR
  $("#formEnvio").submit(function (e) {
    e.preventDefault();
    mesa = $.trim($("#mesa").val());
    sufragos = $.trim($("#sufraga").val());
    votos1  = $.trim($("#votos1").val());
    votos2  = $.trim($("#votos2").val());
    votos3  = $.trim($("#votos3").val());
    votos4  = $.trim($("#votos4").val());
    votos5  = $.trim($("#votos5").val());
    votos6  = $.trim($("#votos6").val());
    votos7  = $.trim($("#votos7").val());
    votos08 = $.trim($("#votos8").val());
    votos09 = $.trim($("#votos9").val());
    votos10 = $.trim($("#votos10").val());

    const checkbox = document.getElementById('recuento');
    const checkbox2 = document.getElementById('reclama');

    checkbox.addEventListener('change', function () {
      if (this.checked) {
        this.value = '1';
      } else {
        this.value = '0';
      }
    });

    checkbox2.addEventListener('change', function () {
      if (this.checked) {
        this.value = '1';
      } else {
        this.value = '0';
      }
    });

    validarDatos();

    if (!pasar) { return }
    crearJSON();
    data = {
      registros: registros
    }

    $("#votos1").attr("autofocus", true);
    const btnEnabled = $.ajax({
      url: "/envios/update/" + myllave,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (res) {
        tablaEnvios.ajax.reload(null, false);
      },
    });
    Swal.fire("La mesa se Actualizo Correctamente!", "", "success");

    $("#modalEnvios").modal("hide");
  });
});