import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
} from 'react-native';

// ============================================================
// TAREFAS FICTÍCIAS
// ============================================================

const tarefasFake = [
    {
        id: '1',
        titulo: 'Estudar React Native',
        descricao: 'Revisar componentes e navegação.',
        concluida: false,
    },

    {
        id: '2',
        titulo: 'Fazer atividade',
        descricao: 'Finalizar atividade da disciplina.',
        concluida: false,
    },

    {
        id: '3',
        titulo: 'Estudar Firebase',
        descricao: 'Revisar Firestore e autenticação.',
        concluida: true,
    },

    {
        id: '4',
        titulo: 'Preparar apresentação',
        descricao: 'Organizar os slides do projeto.',
        concluida: false,
    },
];

// ============================================================
// TELA DE TAREFAS
// ============================================================

export default function Tarefas() {

    // ==========================================================
    // RENDERIZA UMA TAREFA
    // ==========================================================

    const renderTarefa = ({ item }: any) => {

        return (

            <View style= { styles.tarefa } >

            {/* ==================================================
            INFORMAÇÕES DA TAREFA
        =================================================== */}

            < View style = { styles.tarefaConteudo } >

                <Text
            style={
            [
                styles.tituloTarefa,
                item.concluida &&
                styles.tarefaConcluida,
            ]
        }
          >
        { item.titulo }
            </Text>

            < Text style = { styles.descricaoTarefa } >
            { item.descricao }
                </Text>

                </View>

        {/* ==================================================
            STATUS
        =================================================== */}

        <View
          style={
            [
                styles.status,

                item.concluida
                    ? styles.statusConcluida
                    : styles.statusPendente,
            ]
        }
        >

            <Text style={ styles.statusTexto }>
            {
                item.concluida
                    ? 'Concluída'
                    : 'Pendente'
            }
                </Text>

                </View>

                </View>

    );
};

// ==========================================================
// INTERFACE
// ==========================================================

return (

    <SafeAreaView style= { styles.container } >

    {/* ====================================================
          CABEÇALHO
      ===================================================== */}

    < View style = { styles.header } >

        <View>

        <Text style={ styles.ola }>
            Olá!
            </Text>

            < Text style = { styles.titulo } >
                Minhas tarefas
                    </Text>

                    </View>

                    < Text style = { styles.logo } >
                        Tarefino
                        </Text>

                        </View>

{/* ====================================================
          LISTA DE TAREFAS
      ===================================================== */}

<FlatList
        data={ tarefasFake }
keyExtractor = {(item) => item.id}
renderItem = { renderTarefa }
contentContainerStyle = { styles.lista }
showsVerticalScrollIndicator = { false}
    />

{/* ====================================================
          BOTÃO NOVA TAREFA
      ===================================================== */}

    < TouchableOpacity
style = { styles.botaoNovaTarefa }
onPress = {() => {
    console.log('Nova tarefa');
}}
      >

    <Text style={ styles.botaoTexto }>
        + Nova tarefa
            </Text>

            </TouchableOpacity>

            </SafeAreaView>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },

    // ==========================================================
    // CABEÇALHO
    // ==========================================================

    header: {
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 20,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    ola: {
        fontSize: 16,
        color: '#777',
        marginBottom: 4,
    },

    titulo: {
        fontSize: 28,
        fontWeight: '700',
        color: '#222',
    },

    logo: {
        fontSize: 20,
        fontWeight: '700',
        color: '#208AEF',
    },

    // ==========================================================
    // LISTA
    // ==========================================================

    lista: {
        paddingHorizontal: 20,
        paddingBottom: 110,
    },

    // ==========================================================
    // TAREFA
    // ==========================================================

    tarefa: {
        backgroundColor: '#FFF',
        borderRadius: 14,
        padding: 18,
        marginBottom: 14,

        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 2,
        },

        shadowOpacity: 0.08,

        shadowRadius: 5,

        elevation: 2,
    },

    tarefaConteudo: {
        marginBottom: 12,
    },

    tituloTarefa: {
        fontSize: 18,
        fontWeight: '600',
        color: '#222',
        marginBottom: 6,
    },

    tarefaConcluida: {
        textDecorationLine: 'line-through',
        color: '#888',
    },

    descricaoTarefa: {
        fontSize: 14,
        color: '#777',
        lineHeight: 20,
    },

    // ==========================================================
    // STATUS
    // ==========================================================

    status: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },

    statusConcluida: {
        backgroundColor: '#DFF5E5',
    },

    statusPendente: {
        backgroundColor: '#FFF1D6',
    },

    statusTexto: {
        fontSize: 12,
        fontWeight: '600',
        color: '#555',
    },

    // ==========================================================
    // BOTÃO NOVA TAREFA
    // ==========================================================

    botaoNovaTarefa: {
        position: 'absolute',

        bottom: 25,

        left: 20,

        right: 20,

        backgroundColor: '#208AEF',

        borderRadius: 14,

        paddingVertical: 16,

        alignItems: 'center',
    },

    botaoTexto: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },

});