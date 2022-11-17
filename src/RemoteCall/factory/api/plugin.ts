/*
 * Filename: /home/cc/vscode-leetcode-problem-rating/src/RemoteCall/factory/api/plugin.ts
 * Path: /home/cc/vscode-leetcode-problem-rating
 * Created Date: Monday, November 14th 2022, 4:04:31 pm
 * Author: ccagml
 *
 * Copyright (c) 2022 ccagml . All rights reserved.
 */

import { configUtils } from "../../utils/configUtils";
import { reply } from "../../utils/ReplyUtils";
import { chain } from "../../actionChain/chain";
import { sessionUtils } from "../../utils/sessionUtils";
import { ApiBase } from "../baseApi";

class PluginApi extends ApiBase {
  constructor() {
    super();
  }

  callArg(argv) {
    let argv_config = this.api_argv()
      .option("d", {
        alias: "disable",
        type: "boolean",
        describe: "Disable plugin",
        default: false,
      })
      .option("e", {
        alias: "enable",
        type: "boolean",
        describe: "Enable plugin",
        default: false,
      })
      .option("i", {
        alias: "install",
        type: "boolean",
        describe: "Install plugin",
        default: false,
      })
      .positional("name", {
        type: "string",
        describe: "Filter plugin by name",
        default: "",
      });

    argv_config.parseArgFromCmd(argv);

    return argv_config.get_result();
  }

  call(argv) {
    sessionUtils.argv = argv;

    let all_plugin = chain.installed;
    const name = argv.name;

    // if (argv.install) {
    //   const cb = function (e, p) {
    //     if (e) return log.fatal(e);
    //     p.help();
    //     p.save();
    //     chain.init();
    //   };

    //   return;
    // }

    if (name) {
      all_plugin = all_plugin.filter((x) => x.name === name);
    }
    if (all_plugin.length === 0) {
      return reply.fatal("Plugin not found!");
    }

    const p = all_plugin[0];
    if (argv.enable) {
      p.enabled = true;
      p.save();
    } else if (argv.disable) {
      p.enabled = false;
      p.save();
    } else if (argv.delete) {
      // p.delete();
      p.save();
      chain.init();
    } else if (argv.config) {
      reply.info(JSON.stringify(configUtils.plugins[name] || {}, null, 2));
    }
  }
}

export const pluginApi: PluginApi = new PluginApi();
