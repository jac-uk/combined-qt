<template>
  <v-container grid-list-xl>
    <v-layout wrap>
      <v-flex mx-auto>
        <v-card>
          <v-card-title>
            SJ Starts
          </v-card-title>
          <v-card-text>
            <v-chip pill x-large color="primary" class="ma-2">
              <v-icon>mdi-account-clock</v-icon>&nbsp;
              {{ situationalJudgementStart }}
            </v-chip>
            <v-progress-linear
              color="primary"
              height="20"
              :value="sjStartProgress"
              striped
              ></v-progress-linear>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>
            SJ Finishes
          </v-card-title>
          <v-card-text>
            <v-chip pill x-large color="green" class="ma-2">
              <v-icon>mdi-account-clock</v-icon>&nbsp;
              {{ situationalJudgementFinish }}
            </v-chip>
            <v-progress-linear
              color="green"
              height="20"
              :value="sjFinishProgress"
              striped
              ></v-progress-linear>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>
            CA Starts
          </v-card-title>
          <v-card-text>
            <v-chip pill x-large color="indigo" class="ma-2">
              <v-icon>mdi-account-clock</v-icon>&nbsp;
              {{ criticalAnalysisStart }}
            </v-chip>
            <v-spacer></v-spacer>
            <v-progress-linear
              color="indigo"
              height="20"
              :value="caStartProgress"
              striped
              ></v-progress-linear>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>
            CA Finishes
          </v-card-title>
          <v-card-text>
            <v-chip pill x-large color="orange" class="ma-2">
              <v-icon>mdi-account-clock</v-icon>&nbsp;
              {{ criticalAnalysisFinish }}
            </v-chip>
            <v-spacer></v-spacer>
            <v-progress-linear
              color="orange"
              height="20"
              :value="caFinishProgress"
              striped
              ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
export default {
  created() {
    this.loadCounters()
  },
  computed: {
    ...mapGetters(
      "counters",
      [
        "situationalJudgementStart",
        "situationalJudgementFinish",
        "criticalAnalysisStart",
        "criticalAnalysisFinish",
      ]
    ),
    ...mapState("counters", ["expected"]),
    sjStartProgress: function() {
      return Math.round(this.situationalJudgementStart / this.expected * 100)
    },
    sjFinishProgress: function() {
      return Math.round(this.situationalJudgementFinish / this.expected * 100)
    },
    caStartProgress: function() {
      return Math.round(this.criticalAnalysisStart / this.expected * 100)
    },
    caFinishProgress: function() {
      return Math.round(this.criticalAnalysisFinish / this.expected * 100)
    }
  },
  methods: {
    ...mapActions("counters", ["bind"]),
    async loadCounters() {
      await this.bind(this.slug);
    }
  }
};
</script>
