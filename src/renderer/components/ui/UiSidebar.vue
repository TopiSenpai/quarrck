<template>
	<div class="ui-sidebar">
		<div>
			<router-link to="/">
				<ui-icon class="ui-sidebar-icon" type="secondary" icon="public" color="white" />
			</router-link>
			<ui-tooltip position="right">Home</ui-tooltip>
		</div>
	
		<div v-for="server in servers" :key="server.url">
			<router-link :to="`/server/${server.url}`">
				<img :src="server.icon" class="ui-sidebar-icon" />
			</router-link>
			<ui-tooltip position="right">{{ server.name }}</ui-tooltip>
		</div>
			
		<ui-icon-button class="ui-sidebar-icon" type="secondary" icon="add" color="white" tooltip="Add Server" tooltipPosition="right" @click="openAddServerModal" />

		<!-- Modals -->
		<ui-modal ref="addServer">
			<ui-textbox v-model="name" label="Name" />
			<ui-textbox v-model="address" label="IP-Address" />
			<ui-icon-button label="connect" icon="arrow_forward_ios" color="white" @click="addServer" />
		</ui-modal>
	</div>
</template>

<script>

export default {
	name: "ui-sidebar",

	props: {
		servers: {
			required: true,
			type: Array
		}
	},
	
	data () {
		return {
			name: '',
			address: ''
		}
	},

	methods: {
		openAddServerModal () {
			this.$refs.addServer.open()
		},
		addServer () {
			this.$emit('add-server', this.name, this.address)
			this.name = ''
			this.address = ''
		}
	}
};
</script>

<style lang="less" scoped>
@import "../../colors.less";

/deep/ .tippy-popper {
	background-color: red;
}

/deep/ .ui-icon {
	font-size: 40px;
}

.ui-sidebar {
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
	padding: 8px;
	background-color: @toolbar;
	&-icon {
		padding: 0;
		width: 60px;
		height: 60px;
		font-size: 60px;
		color: @icon;
	}
}
</style>