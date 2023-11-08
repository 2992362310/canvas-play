<template>
    <div>
        <p>vue-json-editor</p>
        <vue-json-editor v-model="json" :show-btns="true" :expandedOnStart="true" @json-change="onJsonChange"></vue-json-editor>
    </div>
</template>

<script>
    import vueJsonEditor from 'vue-json-editor'
    import mapconfig from '../components/JsonEditor/mapconfig.json'

    export default {
        data() {
            return {
                json: mapconfig
            }
        },

        components: {
            vueJsonEditor
        },

        methods: {
            onJsonChange(value) {
                console.log('value:', value)
            }
        }
    }
</script>