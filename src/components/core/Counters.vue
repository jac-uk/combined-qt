<template>
  <v-container grid-list-xl>
    <v-layout wrap>
      <v-flex mx-auto>
        <v-card>
          <v-card-title>
            Situational Judgement Starts
          </v-card-title>
          <v-card-text>
            <v-chip pill x-large color="primary" class="ma-2">
              <v-icon>mdi-account-clock</v-icon>&nbsp;
              {{ situationalJudgementStart }}
            </v-chip>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>
            Situational Judgement Finishes
          </v-card-title>
          <v-card-text>
            <v-chip pill x-large color="green">
              <v-icon>mdi-account-clock</v-icon>&nbsp;
              {{ situationalJudgementFinish }}
              </v-icon>
            </v-chip>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>
            Critical Analysis Starts
          </v-card-title>
          <v-card-text>
            <v-chip pill x-large color="indigo">
              <v-icon>mdi-account-clock</v-icon>&nbsp;
              {{ criticalAnalysisStart }}
              </v-icon>
            </v-chip>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>
            Critical Analysis Finishes
          </v-card-title>
          <v-card-text>
            <v-chip pill x-large color="orange">
              <v-icon>mdi-account-clock</v-icon>&nbsp;
              {{ criticalAnalysisFinish }}
              </v-icon>
            </v-chip>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
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
  },
  methods: {
    ...mapActions("counters", ["bind"]),
    async loadCounters() {
      await this.bind(this.slug);
    }
  }
};
</script>
