# WIKI FITNESS - APP

## Funcionalidades

### 1 - Cadastro
- 1.1 Nome
- 1.2 Email
- 1.3 Senha

### 2 - Login
- 2.1 Email
- 2.2 Senha

### 3 - Home
Serão exibidos botões por categoria:
- Perna
- Braço
- Peito
- Costas
- Ombro
- Abdômen
- Comprar Bomba

#### 3.1 Perna
Botões por exercício:
- Agachamento
- Leg Press
- Extensora
- Flexora
- Panturrilha

##### 3.1.1 Agachamento
Botões por tipo:
- Agachamento livre

##### 3.1.2 Leg Press
Botões por tipo:
- Leg Press 45

##### 3.1.3 Extensora
Botões por tipo:
- Extensora

##### 3.1.4 Flexora
Botões por tipo:
- Flexora

##### 3.1.5 Panturrilha
Botões por tipo:
- Panturrilha sentado

#### 3.2 Braço
Botões por exercício:
- Rosca direta
- Rosca alternada
- Rosca martelo
- Tríceps testa
- Tríceps coice
- Tríceps corda

#### 3.3 Peito
Botões por exercício:
- Supino reto
- Supino inclinado
- Supino declinado
- Crucifixo 
- Cross over

#### 3.4 Costas
Botões por exercício:
- Puxada frontal
- Puxada Costas
- Remada baixa
- Remada alta

#### 3.5 Ombro
Botões por exercício:
- Desenvolvimento
- Elevação lateral
- Elevação frontal
- Elevação posterior
- Encolhimento

#### 3.6 Abdômen
Botões por exercício:
- Abdominal 
- Prancha
- Elevação de pernas
- Elevação de tronco

#### 3.7 Comprar Bomba
- Emitir som

### 4 - Passos
- 4.1 Contador de passos

### 5 - Sobre
- 5.1 Titulo do Projeto
- 5.2 Nome do app
- 5.3 Desenvolvedor
- 5.4 Contato
- 5.5 Sair

## Imports necessários

```javascript
import * as React from 'react';
import { Text, View, Image, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { Pedometer } from 'expo-sensors';
import firebase from './config/config';

