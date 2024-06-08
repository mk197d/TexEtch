import characters from "./characters";
const connectorMap: Map<string, string> = new Map<string, string>();

                                           
/*                                            
             0.5    1                       
      0 ────────────> x                   
      │ ╔═════▲═════╗                     
      │ ║     │     ║                      
      │ ║     ╰─────────── character       
      │ ║     │     ║    ending points     
      │ ║     │     ║                      
  0.5 │ ║<────╯     ║                      
      │ ║           ║                      
      │ ║           ║                      
      │ ║           ║                      
      │ ║           ║                      
   1  ▼ ╚═══════════╝                      
      y                                     
                  ╔═════════════════════╗  
                  ║    ONE KEYBOARD     ║  
                  ║     CHARACTER       ║  
                  ╚═════════════════════╝  
                                            */
                                           
connectorMap.set("0.5_0_1_0.5", characters.N_C_BL);
connectorMap.set("1_0.5_0.5_0", characters.N_C_BL);

connectorMap.set("0.5_0_0_0.5", characters.N_C_BR);
connectorMap.set("0_0.5_0.5_0", characters.N_C_BR);

connectorMap.set("0_0.5_0.5_1", characters.N_C_TR);
connectorMap.set("0.5_1_0_0.5", characters.N_C_TR);

connectorMap.set("1_0.5_0.5_1", characters.N_C_TL);
connectorMap.set("0.5_1_1_0.5", characters.N_C_TL);

connectorMap.set("0_1_1_0", characters.BIG_F_SLASH);
connectorMap.set("1_0_0_1", characters.BIG_F_SLASH);

connectorMap.set("0_0_1_1", characters.BIG_B_SLASH);
connectorMap.set("1_1_0_0", characters.BIG_B_SLASH);

connectorMap.set("0_1_1_1", characters.N_HB_WALL);
connectorMap.set("1_1_0_1", characters.N_HB_WALL);
connectorMap.set("0_1_0.5_1", characters.N_HB_WALL);
connectorMap.set("0.5_1_0_1", characters.N_HB_WALL);
connectorMap.set("1_1_0.5_1", characters.N_HB_WALL);
connectorMap.set("1_1_0.5_1", characters.N_HB_WALL);

connectorMap.set("0_0_1_0", characters.N_HT_WALL);
connectorMap.set("1_0_0_0", characters.N_HT_WALL);
connectorMap.set("0_0_0.5_0", characters.N_HT_WALL);
connectorMap.set("0.5_0_0_0", characters.N_HT_WALL);
connectorMap.set("0.5_0_1_0", characters.N_HT_WALL);
connectorMap.set("1_0_0.5_0", characters.N_HT_WALL);

connectorMap.set("1_1_1_0", characters.RIGHT_BAR);
connectorMap.set("1_0_1_1", characters.RIGHT_BAR);
connectorMap.set("1_0.5_1_0", characters.RIGHT_BAR);
connectorMap.set("1_0_1_0.5", characters.RIGHT_BAR);
connectorMap.set("1_1_1_0.5", characters.RIGHT_BAR);
connectorMap.set("1_0.5_1_1", characters.RIGHT_BAR);

connectorMap.set("0_1_0_0", characters.LEFT_BAR);
connectorMap.set("0_0_0_1", characters.LEFT_BAR);
connectorMap.set("0_1_0_0.5", characters.LEFT_BAR);
connectorMap.set("0_0.5_0_1", characters.LEFT_BAR);
connectorMap.set("0_0.5_0_0", characters.LEFT_BAR);
connectorMap.set("0_0_0_0.5", characters.LEFT_BAR);

connectorMap.set("0.5_0_0.5_1", characters.MIDDLE_BAR);
connectorMap.set("0.5_1_0.5_0", characters.MIDDLE_BAR);

connectorMap.set("0_0.5_1_0.5", characters.LINE_N_H);
connectorMap.set("1_0.5_0_0.5", characters.LINE_N_H);

connectorMap.set("0_1_0.5_0", "|");
connectorMap.set("0.5_0_0_1", "|");

connectorMap.set("1_1_0.5_0", "|");
connectorMap.set("0.5_0_1_1", "|");

connectorMap.set("0_0_0.5_1", "|");
connectorMap.set("0.5_1_0_0", "|");

connectorMap.set("1_0_0.5_1", "|");
connectorMap.set("0.5_1_1_0", "|");

connectorMap.set("0_1_0.5_1", characters.N_HB_WALL);
connectorMap.set("0.5_1_0_1", characters.N_HB_WALL);
connectorMap.set("1_1_0.5_1", characters.N_HB_WALL);
connectorMap.set("1_1_0.5_1", characters.N_HB_WALL);

connectorMap.set("0_0.5_1_0", characters.F_SLASH);
connectorMap.set("1_0_0_0.5", characters.F_SLASH);
connectorMap.set("1_0.5_0_1", characters.F_SLASH);
connectorMap.set("0_1_1_0.5", characters.F_SLASH); 

connectorMap.set("0_0_1_0.5", characters.B_SLASH);
connectorMap.set("1_0.5_0_0", characters.B_SLASH);
connectorMap.set("1_0.5_1_1", characters.B_SLASH);
connectorMap.set("1_1_1_0.5", characters.B_SLASH);
connectorMap.set("0_0.5_1_1", characters.B_SLASH);
connectorMap.set("1_1_0_0.5", characters.B_SLASH);

export { connectorMap };