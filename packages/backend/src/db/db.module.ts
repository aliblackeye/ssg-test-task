import { Module } from '@nestjs/common';
import { DBService } from './db.service'; // DBService'i ekliyoruz

@Module({
  providers: [DBService], // DBService burada bir provider olarak ekleniyor
  exports: [DBService], // Başka modüllerin erişebilmesi için export ediyoruz
})
export class DBModule {}
