// Horario de atención por día de la semana.
// 0 = domingo, 1 = lunes, 2 = martes, 3 = miércoles, 4 = jueves, 5 = viernes, 6 = sábado
// Cambia estos valores por el horario real de la clínica.

const horarioSemanal = {
  0: null,                            // domingo: cerrado
  1: { inicio: '08:00', fin: '17:00' },
  2: { inicio: '08:00', fin: '17:00' },
  3: { inicio: '08:00', fin: '17:00' },
  4: { inicio: '08:00', fin: '17:00' },
  5: { inicio: '08:00', fin: '17:00' },
  6: { inicio: '08:00', fin: '12:00' } // sábado: medio día
};

const DURACION_CITA_MINUTOS = 30;

module.exports = { horarioSemanal, DURACION_CITA_MINUTOS };