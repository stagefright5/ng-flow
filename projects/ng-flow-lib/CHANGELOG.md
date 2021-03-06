## [0.0.5-alpha.16](https://github.com/stagefright5/ng-flow/compare/0.0.5-alpha.0...0.0.5-alpha.16) (2020-07-15)


### Bug Fixes

* opening a "wheel" desc panel fucks up other component overlays ([70c10ec](https://github.com/stagefright5/ng-flow/commit/70c10ec23230a500e8f9da71f221d216db655bd6))



## [0.0.5-alpha.0](https://github.com/stagefright5/ng-flow/compare/0.0.4-alpha.22...0.0.5-alpha.0) (2020-07-08)


### Features

* **node!:** Node.Config.`id` is mandatory ([b8cf68a](https://github.com/stagefright5/ng-flow/commit/b8cf68a23fbca20727638c746eadbc34d82ad450))
* **nodes:** Expose "updateNodes" method on "FlowComponent" instance. ([a0526fc](https://github.com/stagefright5/ng-flow/commit/a0526fca3ea820c333c56ce6c38b574e6371a1fb))


### BREAKING CHANGES

* **node!:** the config provided for each node should have `id` property which was previuosly optional



## [0.0.4-alpha.22](https://github.com/stagefright5/ng-flow/compare/0.0.4-alpha.21...0.0.4-alpha.22) (2020-07-02)


### Bug Fixes

* **connectors:** "to" & "from" have same direction ([b646e7b](https://github.com/stagefright5/ng-flow/commit/b646e7bc192d475b831513ed405701b65ecf6665))



## [0.0.4-alpha.21](https://github.com/stagefright5/ng-flow/compare/0.0.3-alpha.21...0.0.4-alpha.21) (2020-07-02)


### Features

* **node,wheel:** Provide custom data for respective components ([6c23c24](https://github.com/stagefright5/ng-flow/commit/6c23c245bec63dd73d94f86b1b04fadfaf4282fa))



## [0.0.3-alpha.21](https://github.com/stagefright5/ng-flow/compare/0.0.3-alpha.20...0.0.3-alpha.21) (2020-06-15)


### Bug Fixes

* **connectors:** Do not draw if start and end are same ([677e1f6](https://github.com/stagefright5/ng-flow/commit/677e1f684b58dff84e47762507ac537fb8fdfed8))



## [0.0.3-alpha.20](https://github.com/stagefright5/ng-flow/compare/0.0.3-alpha.15...0.0.3-alpha.20) (2020-06-15)


### Features

* **connectors:** [BREAKING] mandatory `to` or `from` options for a node. ([18d38b8](https://github.com/stagefright5/ng-flow/commit/18d38b81e3df9aa4afc1bdf9b74b0bb1f827c280))



## [0.0.3-alpha.15](https://github.com/stagefright5/ng-flow/compare/ac046cc45a2e6c7681df36e67d377cb91ffe09b5...0.0.3-alpha.15) (2020-05-26)


### Bug Fixes

* **delete_node:** Associated connectors were not getting deleted ([8a0dd21](https://github.com/stagefright5/ng-flow/commit/8a0dd214e20d8d16f0aac7664411a907e4960396))
* **leader-lines-scroll:** Leader lines overflows the container on scroll when it was supposed to look hidden ([1db0f79](https://github.com/stagefright5/ng-flow/commit/1db0f7953a659f81fc84097abcdf51077624c2fa))
* **position:** Initialize addition factor with the one node space's width ([fed6218](https://github.com/stagefright5/ng-flow/commit/fed6218234594bc52b24a2f04e6242e9ab3c3281))
* **templateParse:** Do not send arg when it is not expected ([d838641](https://github.com/stagefright5/ng-flow/commit/d83864121576b9784f880eb2dcfefef6f138b62e))


### Features

* **history:** Get the most recent history entry ([1337ca0](https://github.com/stagefright5/ng-flow/commit/1337ca0de29a0ef6fbc1714327e437e4fd1a3971))
* **node:** [WIP] add indivdual node's height and width option ([ac43c1e](https://github.com/stagefright5/ng-flow/commit/ac43c1e4c20a18b61d70ba1dff82db000ed451c3))
* **node:** Accept "width", "height" and gap as input param"nodeHeight", "nodeWidth" and "nodeGap" Input properties are exposed in the flow component . These values are of type number, which is assigned as pixel vlues ([c1c955e](https://github.com/stagefright5/ng-flow/commit/c1c955ecc15657d1fafcc9cd0c5cd167e5403144))
* **nodes:** delete a node ([ac046cc](https://github.com/stagefright5/ng-flow/commit/ac046cc45a2e6c7681df36e67d377cb91ffe09b5))
* **nodes:** Give "id" for each node ([aceeca0](https://github.com/stagefright5/ng-flow/commit/aceeca04212388ce1f59e42b4612f2af899d48ad))
* **nodes:** Give height/width for individual nodes ([3c564a4](https://github.com/stagefright5/ng-flow/commit/3c564a45f57cc95e212fe4c8956e9ccd930b9b2f))
* **nodes:** Rerender all the node of a flow preserving the connectors ([2b861c8](https://github.com/stagefright5/ng-flow/commit/2b861c818bf55eccfe4d1fd0d3089bb1e7c3e6ea))
* **refactor:** Maintain all the history with the row number and node data ([c190bb1](https://github.com/stagefright5/ng-flow/commit/c190bb195cc988c0fa6a8ab24fc4541f3a6a6a8b))



