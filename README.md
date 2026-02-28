# 📚 Sistema Académico

##  Descripción

Este proyecto representa la estructura básica de un sistema académico donde:

- Un **Alumno** pertenece a una **Carrera**
- Una **Carrera** contiene varios **Años Escolares**
- Un **Año Escolar** contiene varias **Clases**

Relación jerárquica:

Alumno → Carrera → Año Escolar → Clase

---

# 🧩 Modelo de Entidades

## 1️ Alumno

Representa a los estudiantes inscritos en la institución.

### Atributos:

- id_alumno (PK)
- nombre
- apellido
- fecha_nacimiento
- email
- id_carrera (FK)

### Relación:
- Un alumno pertenece a una sola carrera.
- Una carrera puede tener muchos alumnos.

---

## 2️⃣ Carrera

Representa los programas académicos ofrecidos.

### Atributos:

- id_carrera (PK)
- nombre_carrera
- descripcion
- duracion_anios

### Relación:
- Una carrera tiene varios años escolares.
- Una carrera tiene muchos alumnos.

---

## 3️⃣ Año Escolar

Representa cada nivel académico dentro de una carrera.

### Atributos:

- id_anio (PK)
- nombre_anio (Ejemplo: 1er Año, 2do Año)
- id_carrera (FK)

### Relación:
- Un año escolar pertenece a una sola carrera.
- Un año escolar tiene muchas clases.

---

## 4️ Clase

Representa las asignaturas impartidas en cada año escolar.

### Atributos:

- id_clase (PK)
- nombre_clase
- creditos
- id_anio (FK)

### Relación:
- Una clase pertenece a un año escolar.

---

# 🔗 Diagrama Relacional
