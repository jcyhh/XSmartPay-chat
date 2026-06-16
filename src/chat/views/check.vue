<template>
    <div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    mounted() {
        this.$chatApi.get('/api/users/my').then(res=>{
            if(res.is_kefu){
                this.$router.push({
                    path:`/sessions`
                })
            }else{
                this.$chatApi.get('/api/chat/customer_service').then(data=>{
                    this.$router.push({
                        path:`/friend/${data.receiver_id}`,
                        query: {
                            talkId: 0,
                            name: data.name,
                            avatar: data.avatar
                        }
                    })
                })
                
            }
        })
    }
}
</script>

<style>
</style>